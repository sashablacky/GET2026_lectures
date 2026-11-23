using System.Collections.Concurrent;
using Lecture9Api.Data;
using Lecture9Api.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Lecture9Api.Caching;

public sealed class CachedMeterService : ICachedMeterService
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new();
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedMeterService> _logger;

    private static readonly MemoryCacheEntryOptions CacheOptions =
        new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(5));

    public CachedMeterService(
        ApplicationDbContext context,
        IMemoryCache cache,
        ILogger<CachedMeterService> logger)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
    }

    public async Task<List<MeterInfoDto>> GetMetersAsync(CancellationToken cancellationToken = default)
    {
        if (_cache.TryGetValue(CacheKeys.AllMeters, out List<MeterInfoDto>? meters) && meters is not null)
        {
            _logger.LogInformation("Cache hit for key {CacheKey}", CacheKeys.AllMeters);
            return meters;
        }

        var gate = Locks.GetOrAdd(CacheKeys.AllMeters, _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync(cancellationToken);
        try
        {
            if (_cache.TryGetValue(CacheKeys.AllMeters, out meters) && meters is not null)
            {
                _logger.LogInformation("Cache hit after waiting for key {CacheKey}", CacheKeys.AllMeters);
                return meters;
            }

            _logger.LogInformation("Cache miss for key {CacheKey}; querying database", CacheKeys.AllMeters);
            meters = await _context.MeterInfos.AsNoTracking()
                .OrderBy(m => m.Id)
                .Select(m => new MeterInfoDto(m.Id, m.MeterNumber, m.Location, m.Status))
                .ToListAsync(cancellationToken);
            _cache.Set(CacheKeys.AllMeters, meters, CacheOptions);
            _logger.LogInformation("Created cache entry {CacheKey} with {Count} meters", CacheKeys.AllMeters, meters.Count);
            return meters;
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task<MeterInfoDto?> GetMeterAsync(int id, CancellationToken cancellationToken = default)
    {
        var key = CacheKeys.MeterById(id);
        if (_cache.TryGetValue(key, out MeterInfoDto? meter))
        {
            _logger.LogInformation("Cache hit for key {CacheKey}", key);
            return meter;
        }

        var gate = Locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync(cancellationToken);
        try
        {
            if (_cache.TryGetValue(key, out meter))
            {
                _logger.LogInformation("Cache hit after waiting for key {CacheKey}", key);
                return meter;
            }

            _logger.LogInformation("Cache miss for key {CacheKey}; querying database", key);
            meter = await _context.MeterInfos.AsNoTracking()
                .Where(m => m.Id == id)
                .Select(m => new MeterInfoDto(m.Id, m.MeterNumber, m.Location, m.Status))
                .FirstOrDefaultAsync(cancellationToken);

            if (meter is not null)
            {
                _cache.Set(key, meter, CacheOptions);
                _logger.LogInformation("Created cache entry {CacheKey}", key);
            }
            else
            {
                _logger.LogInformation("Meter {MeterId} was not found; it was not cached", id);
            }

            return meter;
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task<List<CommandLogDto>> GetCommandLogsAsync(int meterId, CancellationToken cancellationToken = default)
    {
        var key = CacheKeys.CommandLogsByMeter(meterId);
        if (_cache.TryGetValue(key, out List<CommandLogDto>? logs) && logs is not null)
        {
            _logger.LogInformation("Cache hit for key {CacheKey}", key);
            return logs;
        }

        var gate = Locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync(cancellationToken);
        try
        {
            if (_cache.TryGetValue(key, out logs) && logs is not null)
            {
                _logger.LogInformation("Cache hit after waiting for key {CacheKey}", key);
                return logs;
            }

            _logger.LogInformation("Cache miss for key {CacheKey}; querying database", key);
            logs = await _context.CommandLogs.AsNoTracking()
                .Where(c => c.MeterInfoId == meterId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommandLogDto(c.Id, c.MeterInfoId, c.Command, c.Status, c.CreatedAt))
                .ToListAsync(cancellationToken);
            _cache.Set(key, logs, CacheOptions);
            _logger.LogInformation("Created cache entry {CacheKey} with {Count} logs", key, logs.Count);
            return logs;
        }
        finally
        {
            gate.Release();
        }
    }
}
