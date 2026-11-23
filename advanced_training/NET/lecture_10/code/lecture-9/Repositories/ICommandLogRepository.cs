using Lecture9Api.Models;

namespace Lecture9Api.Repositories;

public interface ICommandLogRepository : IGenericRepository<CommandLog>
{
    Task<List<CommandLog>> GetByMeterInfoIdAsync(int meterInfoId, CancellationToken cancellationToken = default);
    Task<List<CommandLog>> GetByStatusAsync(CommandStatus status, CancellationToken cancellationToken = default);
}
