using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using AsyncMeterMonitoring.Models;

namespace AsyncMeterMonitoring.Services;

public class MeterPingService
{
    public MeterPingResult PingMeter(MeterInfo meter)
    {
        Console.WriteLine($"Checking {meter.Name}...");

        var stopwatch = Stopwatch.StartNew();
        Thread.Sleep(3000);
        stopwatch.Stop();

        return new MeterPingResult
        {
            MeterId = meter.Id,
            MeterName = meter.Name,
            IsOnline = true,
            ResponseTimeMs = stopwatch.ElapsedMilliseconds
        };
    }

    public async Task<MeterPingResult> PingMeterAsync(MeterInfo meter)
    {
        Console.WriteLine($"Checking {meter.Name}...");

        var stopwatch = Stopwatch.StartNew();

        var delayMilliseconds = meter.Id switch
        {
        1 => 5000,
        2 => 2000,
        3 => 4000,
        _ => 3000
        };

        await Task.Delay(delayMilliseconds).ConfigureAwait(false);

        stopwatch.Stop();

        return new MeterPingResult
        {
            MeterId = meter.Id,
            MeterName = meter.Name,
            IsOnline = true,
            ResponseTimeMs = stopwatch.ElapsedMilliseconds
        };
    }

    public async IAsyncEnumerable<MeterPingResult> PingAllMetersAsync(
    List<MeterInfo> meters)
    {
        foreach (var meter in meters)
        {
            yield return await PingMeterAsync(meter);
        }
    }

    public async IAsyncEnumerable<MeterPingResult> PingAllMetersConcurrentlyAsync(
    List<MeterInfo> meters)
    {
        var tasks = new List<Task<MeterPingResult>>();

        foreach (var meter in meters)
        {
            tasks.Add(PingMeterAsync(meter));
        }

        while (tasks.Count > 0)
        {
            var completedTask = await Task.WhenAny(tasks);
            tasks.Remove(completedTask);
            yield return await completedTask;
        }
    }
}