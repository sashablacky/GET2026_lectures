using Lecture9Api.Data;
using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Repositories;

public class CommandLogRepository(ApplicationDbContext context)
    : GenericRepository<CommandLog>(context), ICommandLogRepository
{
    public async Task<List<CommandLog>> GetByMeterInfoIdAsync(int meterInfoId, CancellationToken cancellationToken = default) =>
        await Context.CommandLogs.AsNoTracking()
            .Where(log => log.MeterInfoId == meterInfoId)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<List<CommandLog>> GetByStatusAsync(CommandStatus status, CancellationToken cancellationToken = default) =>
        await Context.CommandLogs.AsNoTracking()
            .Where(log => log.Status == status)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
}
