using Lecture9Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeterStatisticsController : ControllerBase
{
    private readonly IMeterStatisticsRepository _statistics;

    public MeterStatisticsController(IMeterStatisticsRepository statistics)
    {
        _statistics = statistics;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? location,
        [FromQuery] DateTime? start,
        [FromQuery] DateTime? end)
    {
        if (start.HasValue && end.HasValue && end.Value < start.Value)
            return BadRequest("End must not be earlier than start.");

        var activeByLocation = location is null
            ? 0
            : await _statistics.GetActiveMetersByLocationAsync(location);
        var countInRange = start.HasValue && end.HasValue
            ? await _statistics.GetReadingCountInRangeAsync(start.Value, end.Value)
            : 0;

        return Ok(new
        {
            TotalMeters = await _statistics.GetTotalMetersAsync(),
            ActiveMetersByLocation = activeByLocation,
            AverageReading = await _statistics.GetAverageReadingAsync(),
            MinimumReading = await _statistics.GetMinimumReadingAsync(),
            MaximumReading = await _statistics.GetMaximumReadingAsync(),
            ReadingCountInRange = countInRange
        });
    }
}
