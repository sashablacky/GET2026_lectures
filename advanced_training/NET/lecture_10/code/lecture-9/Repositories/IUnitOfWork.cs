namespace Lecture9Api.Repositories;

public interface IUnitOfWork
{
    IMeterInfoRepository MeterInfo { get; }
    ICommandLogRepository CommandLog { get; }
    IMeterReadingRepository MeterReading { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
