using Lecture9Api.DTOs;

namespace Lecture9Api.Services;

public interface IMeterImportService
{
    Task<MeterImportSummary> ImportAsync(IFormFile file, CancellationToken cancellationToken = default);
    Task ProcessJobAsync(Guid jobId, CancellationToken cancellationToken = default);
}
