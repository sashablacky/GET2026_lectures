using Lecture9Api.DTOs;
using Lecture9Api.Models;

namespace Lecture9Api.Caching;

public interface ICachedMeterService
{
    Task<List<MeterInfoDto>> GetMetersAsync(CancellationToken cancellationToken = default);
    Task<MeterInfoDto?> GetMeterAsync(int id, CancellationToken cancellationToken = default);
    Task<List<CommandLogDto>> GetCommandLogsAsync(int meterId, CancellationToken cancellationToken = default);
}
