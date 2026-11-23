using Lecture9Api.Data;
using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Repositories;

public class MeterReadingRepository(ApplicationDbContext context)
    : GenericRepository<MeterReading>(context), IMeterReadingRepository
{
    public async Task<List<MeterReading>> GetByMeterAsync(int meterInfoId, CancellationToken cancellationToken = default) =>
        await Context.MeterReadings.AsNoTracking()
            .Where(reading => reading.MeterInfoId == meterInfoId)
            .OrderByDescending(reading => reading.RecordedAt)
            .ToListAsync(cancellationToken);

    public async Task<List<MeterReading>> GetInRangeAsync(int meterInfoId, DateTime start, DateTime end, CancellationToken cancellationToken = default) =>
        await Context.MeterReadings.AsNoTracking()
            .Where(reading => reading.MeterInfoId == meterInfoId &&
                              reading.RecordedAt >= start && reading.RecordedAt <= end)
            .OrderByDescending(reading => reading.RecordedAt)
            .ToListAsync(cancellationToken);

    public async Task<MeterReading?> GetLatestAsync(int meterInfoId, CancellationToken cancellationToken = default) =>
        await Context.MeterReadings.AsNoTracking()
            .Where(reading => reading.MeterInfoId == meterInfoId)
            .OrderByDescending(reading => reading.RecordedAt)
            .ThenByDescending(reading => reading.Id)
            .FirstOrDefaultAsync(cancellationToken);
}
