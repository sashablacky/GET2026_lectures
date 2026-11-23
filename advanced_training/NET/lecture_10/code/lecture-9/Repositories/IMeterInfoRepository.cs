using Lecture9Api.Models;

namespace Lecture9Api.Repositories;

public interface IMeterInfoRepository : IGenericRepository<MeterInfo>
{
    Task<List<MeterInfo>> GetByLocationAsync(string location, CancellationToken cancellationToken = default);
    Task<List<MeterInfo>> GetByStatusAsync(MeterStatus status, CancellationToken cancellationToken = default);
}
