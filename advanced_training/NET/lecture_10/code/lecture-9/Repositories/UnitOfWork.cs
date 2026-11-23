using Lecture9Api.Data;

namespace Lecture9Api.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        MeterInfo = new MeterInfoRepository(context);
        CommandLog = new CommandLogRepository(context);
        MeterReading = new MeterReadingRepository(context);
    }

    public IMeterInfoRepository MeterInfo { get; }
    public ICommandLogRepository CommandLog { get; }
    public IMeterReadingRepository MeterReading { get; }
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _context.SaveChangesAsync(cancellationToken);
}
