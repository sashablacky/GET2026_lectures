using Lecture9Api.Data;
using Lecture9Api.Caching;
using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Lecture9Api.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<UnitOfWork> _logger;

    public UnitOfWork(
        ApplicationDbContext context,
        IMemoryCache cache,
        ILogger<UnitOfWork> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        MeterInfo = new MeterInfoRepository(context);
        CommandLog = new CommandLogRepository(context);
        MeterReading = new MeterReadingRepository(context);
    }

    public IMeterInfoRepository MeterInfo { get; }
    public ICommandLogRepository CommandLog { get; }
    public IMeterReadingRepository MeterReading { get; }
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var changedEntries = _context.ChangeTracker.Entries()
            .Where(entry =>
                entry.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
            .ToList();

        var meterIds = new HashSet<int>();
        var meterLogIds = new HashSet<int>();

        foreach (var entry in changedEntries)
        {
            if (entry.Entity is MeterInfo meter)
            {
                if (meter.Id > 0)
                {
                    meterIds.Add(meter.Id);
                }
            }
            else if (entry.Entity is CommandLog log)
            {
                if (entry.Property(nameof(Lecture9Api.Models.CommandLog.MeterInfoId)).OriginalValue is int originalMeterInfoId)
                {
                    meterLogIds.Add(originalMeterInfoId);
                }
                if (entry.Property(nameof(Lecture9Api.Models.CommandLog.MeterInfoId)).CurrentValue is int meterInfoId)
                {
                    meterLogIds.Add(meterInfoId);
                }
            }
        }

        var saved = await _context.SaveChangesAsync(cancellationToken);

        _cache.Remove(CacheKeys.AllMeters);
        _cache.Remove(CacheKeys.MeterSummary);
        _cache.Remove(CacheKeys.MeterHistory);
        _logger.LogInformation("Cache invalidated after save: {CacheKey}", CacheKeys.AllMeters);

        foreach (var meterId in meterIds)
        {
            RemoveMeterKeys(meterId);
        }

        foreach (var meterId in meterLogIds)
        {
            var key = CacheKeys.CommandLogsByMeter(meterId);
            _cache.Remove(key);
            _logger.LogInformation("Cache invalidated: {CacheKey}", key);
        }

        return saved;
    }

    private void RemoveMeterKeys(int meterId)
    {
        var meterKey = CacheKeys.MeterById(meterId);
        var logKey = CacheKeys.CommandLogsByMeter(meterId);
        _cache.Remove(meterKey);
        _cache.Remove(logKey);
        _logger.LogInformation("Cache invalidated: {MeterKey} and {LogKey}", meterKey, logKey);
    }
}
