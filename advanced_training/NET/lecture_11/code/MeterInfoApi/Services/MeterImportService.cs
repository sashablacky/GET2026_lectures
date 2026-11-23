using System.Globalization;
using System.Text.Json;
using System.Xml;
using ClosedXML.Excel;
using CsvHelper;
using CsvHelper.Configuration;
using Lecture9Api.Caching;
using Lecture9Api.Data;
using Lecture9Api.DTOs;
using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Lecture9Api.Services;

public sealed class MeterImportService : IMeterImportService
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<MeterImportService> _logger;

    public MeterImportService(
        ApplicationDbContext context,
        IMemoryCache cache,
        ILogger<MeterImportService> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
    }

    public async Task<MeterImportSummary> ImportAsync(
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        await using var stream = file.OpenReadStream();
        return await ImportStreamAsync(stream, file.FileName, cancellationToken);
    }

    public async Task ProcessJobAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        var job = await _context.ImportJobs.SingleAsync(j => j.Id == jobId, cancellationToken);
        job.Status = ImportJobStatus.Processing;
        job.StartedAt = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        try
        {
            await using var stream = File.OpenRead(job.StoredFilePath);
            var summary = await ImportStreamAsync(
                stream,
                job.FileName,
                cancellationToken,
                onProgress: (processed, successful, failed) =>
                {
                    job.ProcessedRecords = processed;
                    job.SuccessfulRecords = successful;
                    job.FailedRecords = failed;
                });

            job.TotalRecords = summary.TotalRecords;
            job.ProcessedRecords = summary.TotalRecords;
            job.SuccessfulRecords = summary.SuccessfullyInserted;
            job.FailedRecords = summary.RejectedRecords;
            job.ErrorDetails = summary.Errors.Count == 0
                ? null
                : JsonSerializer.Serialize(summary.Errors);
            job.Status = ImportJobStatus.Completed;
            job.CompletedAt = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            job.Status = ImportJobStatus.Failed;
            job.ErrorDetails = ex.Message;
            job.CompletedAt = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync(CancellationToken.None);
            _logger.LogError(ex, "Import job {JobId} failed", jobId);
        }
    }

    private async Task<MeterImportSummary> ImportStreamAsync(
        Stream stream,
        string fileName,
        CancellationToken cancellationToken,
        Action<int, int, int>? onProgress = null)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var existingNumbers = await _context.MeterInfos
            .AsNoTracking()
            .Select(m => m.MeterNumber)
            .ToHashSetAsync(cancellationToken);
        var seenInFile = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var batch = new List<MeterInfo>();
        var errors = new List<ImportValidationError>();
        var total = 0;
        var successful = 0;

        await foreach (var parsed in ParseAsync(stream, extension, cancellationToken))
        {
            total++;
            var recordNumber = parsed.RecordNumber;
            var dto = parsed.Dto;
            var validationErrors = Validate(dto);

            if (validationErrors.Count == 0)
            {
                var meterNumber = dto.MeterNumber.Trim();
                if (existingNumbers.Contains(meterNumber) ||
                    !seenInFile.Add(meterNumber))
                {
                    validationErrors.Add("Duplicate MeterNumber.");
                }
            }

            if (validationErrors.Count > 0)
            {
                foreach (var error in validationErrors)
                {
                    errors.Add(new ImportValidationError(recordNumber, error));
                }
                onProgress?.Invoke(total, successful, errors.Count);
                continue;
            }

            var meter = new MeterInfo
            {
                MeterNumber = dto.MeterNumber.Trim(),
                Location = dto.Location.Trim(),
                Status = dto.Status.Equals("Inactive", StringComparison.OrdinalIgnoreCase)
                    ? MeterStatus.Inactive
                    : MeterStatus.Active
            };

            batch.Add(meter);
            seenInFile.Add(meter.MeterNumber);

            if (batch.Count == 500)
            {
                await _context.MeterInfos.AddRangeAsync(batch, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                foreach (var inserted in batch)
                {
                    existingNumbers.Add(inserted.MeterNumber);
                    successful++;
                }
                _context.ChangeTracker.Clear();
                batch.Clear();
                onProgress?.Invoke(total, successful, errors.Count);
            }
        }

        if (batch.Count > 0)
        {
            await _context.MeterInfos.AddRangeAsync(batch, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            successful += batch.Count;
            _context.ChangeTracker.Clear();
        }

        if (successful > 0)
        {
            _cache.Remove(CacheKeys.AllMeters);
            _cache.Remove(CacheKeys.MeterSummary);
            _cache.Remove(CacheKeys.MeterHistory);
            _logger.LogInformation("Invalidated meter caches after {Count} imported meters", successful);
        }

        onProgress?.Invoke(total, successful, errors.Count);
        return new MeterImportSummary(total, successful, errors.Count, errors);
    }

    private static List<string> Validate(MeterImportDto dto)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(dto.MeterNumber))
            errors.Add("MeterNumber is required.");
        else if (dto.MeterNumber.Trim().Length > 50)
            errors.Add("MeterNumber exceeds 50 characters.");

        if (string.IsNullOrWhiteSpace(dto.Location))
            errors.Add("Location is required.");
        else if (dto.Location.Trim().Length > 100)
            errors.Add("Location exceeds 100 characters.");

        if (!dto.Status.Equals("Active", StringComparison.OrdinalIgnoreCase)
            && !dto.Status.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("Status must be Active or Inactive.");
        }

        return errors;
    }

    private static async IAsyncEnumerable<(int RecordNumber, MeterImportDto Dto)> ParseAsync(
        Stream stream,
        string extension,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken)
    {
        if (extension is ".csv")
        {
            using var reader = new StreamReader(stream, leaveOpen: true);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var recordNumber = 1;
            await foreach (var dto in csv.GetRecordsAsync<MeterImportDto>(cancellationToken))
            {
                yield return (++recordNumber, dto);
            }
            yield break;
        }

        if (extension is ".json")
        {
            var records = await JsonSerializer.DeserializeAsync<List<MeterImportDto>>(
                stream,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
                cancellationToken);
            for (var i = 0; i < (records?.Count ?? 0); i++)
            {
                yield return (i + 1, records![i]);
            }
            yield break;
        }

        if (extension is ".xml")
        {
            using var xmlReader = XmlReader.Create(stream, new XmlReaderSettings
            {
                Async = true,
                IgnoreWhitespace = true
            });
            var recordNumber = 0;
            while (await xmlReader.ReadAsync())
            {
                if (xmlReader.NodeType == XmlNodeType.Element && xmlReader.Name == "Meter")
                {
                    recordNumber++;
                    var xml = (await System.Xml.Linq.XNode.ReadFromAsync(
                        xmlReader,
                        cancellationToken)).ToString();
                    var element = System.Xml.Linq.XElement.Parse(xml);
                    yield return (recordNumber, new MeterImportDto
                    {
                        MeterNumber = element.Element("MeterNumber")?.Value ?? string.Empty,
                        Location = element.Element("Location")?.Value ?? string.Empty,
                        Status = element.Element("Status")?.Value ?? string.Empty
                    });
                }
            }
            yield break;
        }

        if (extension is ".xlsx")
        {
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheets.FirstOrDefault()
                ?? throw new InvalidDataException("The Excel workbook contains no worksheets.");
            var headerRow = worksheet.FirstRowUsed();
            if (headerRow is null)
                throw new InvalidDataException("The Excel worksheet is empty.");

            var columns = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            foreach (var cell in headerRow.CellsUsed())
            {
                columns[cell.GetString().Trim()] = cell.Address.ColumnNumber;
            }

            if (!columns.ContainsKey("MeterNumber") || !columns.ContainsKey("Location") || !columns.ContainsKey("Status"))
                throw new InvalidDataException("Excel columns MeterNumber, Location and Status are required.");

            var recordNumber = 0;
            foreach (var row in worksheet.RowsUsed().Skip(1))
            {
                recordNumber++;
                yield return (recordNumber, new MeterImportDto
                {
                    MeterNumber = row.Cell(columns["MeterNumber"]).GetString(),
                    Location = row.Cell(columns["Location"]).GetString(),
                    Status = row.Cell(columns["Status"]).GetString()
                });
            }
            yield break;
        }

        throw new NotSupportedException($"Unsupported file type '{extension}'.");
    }
}
