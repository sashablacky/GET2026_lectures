using Lecture9Api.Models;

namespace Lecture9Api.Repositories;

public interface IMeterReadingRepository : IGenericRepository<MeterReading>
{
    Task<List<MeterReading>> GetByMeterAsync(int meterInfoId, CancellationToken cancellationToken = default);
    Task<List<MeterReading>> GetInRangeAsync(int meterInfoId, DateTime start, DateTime end, CancellationToken cancellationToken = default);
    Task<MeterReading?> GetLatestAsync(int meterInfoId, CancellationToken cancellationToken = default);
}
