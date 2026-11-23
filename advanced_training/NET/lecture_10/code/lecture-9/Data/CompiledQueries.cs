using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Data;

public static class CompiledQueries
{
    public static readonly Func<ApplicationDbContext, int, Task<MeterInfo?>> GetMeterById =
        EF.CompileAsyncQuery((ApplicationDbContext context, int id) =>
            context.MeterInfos
                .AsNoTracking()
                .FirstOrDefault(m => m.Id == id));

    public static readonly Func<ApplicationDbContext, string, IAsyncEnumerable<MeterInfo>> GetMetersByLocation =
        EF.CompileAsyncQuery<ApplicationDbContext, string, MeterInfo>((context, location) =>
            context.MeterInfos
                .AsNoTracking()
                .Where(m => m.Location == location)
                .OrderBy(m => m.Id));

}
