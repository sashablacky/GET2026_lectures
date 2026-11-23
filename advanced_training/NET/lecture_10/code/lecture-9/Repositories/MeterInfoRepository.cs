using Lecture9Api.Data;
using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Repositories;

public class MeterInfoRepository(ApplicationDbContext context)
    : GenericRepository<MeterInfo>(context), IMeterInfoRepository
{
    public async Task<List<MeterInfo>> GetByLocationAsync(string location, CancellationToken cancellationToken = default) =>
        await Context.MeterInfos.AsNoTracking()
            .Where(meter => meter.Location == location)
            .OrderBy(meter => meter.Id)
            .ToListAsync(cancellationToken);

    public async Task<List<MeterInfo>> GetByStatusAsync(MeterStatus status, CancellationToken cancellationToken = default) =>
        await Context.MeterInfos.AsNoTracking()
            .Where(meter => meter.Status == status)
            .OrderBy(meter => meter.Id)
            .ToListAsync(cancellationToken);
}
