namespace Lecture9Api.Repositories;

public interface IMeterStatisticsRepository
{
    Task<int> GetTotalMetersAsync(CancellationToken cancellationToken = default);
    Task<int> GetActiveMetersByLocationAsync(string location, CancellationToken cancellationToken = default);
    Task<decimal?> GetAverageReadingAsync(CancellationToken cancellationToken = default);
    Task<decimal?> GetMinimumReadingAsync(CancellationToken cancellationToken = default);
    Task<decimal?> GetMaximumReadingAsync(CancellationToken cancellationToken = default);
    Task<int> GetReadingCountInRangeAsync(DateTime start, DateTime end, CancellationToken cancellationToken = default);
}
