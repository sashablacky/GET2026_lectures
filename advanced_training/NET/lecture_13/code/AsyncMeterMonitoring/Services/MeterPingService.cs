using System.Runtime.CompilerServices;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Channels;
using AsyncMeterInfoMonitoring.Models;

namespace AsyncMeterInfoMonitoring.Services;

class MeterPingService
{
    private readonly SemaphoreSlim _pingSemaphore = new(initialCount: 50, maxCount: 50);
    public async Task<MeterPingResult> PingMeterAsync(MeterInfo meter, CancellationToken cancellationToken = default)
    {
        
        await _pingSemaphore.WaitAsync(cancellationToken);
        try
        {
            Console.WriteLine($"Checking {meter.Name}...");

            var stopwatch = Stopwatch.StartNew();

            var delayMilliseconds = Random.Shared.Next(100, 501);

            await Task.Delay(delayMilliseconds, cancellationToken).ConfigureAwait(false);

            stopwatch.Stop();

            return new MeterPingResult
            {
                MeterId = meter.Id,
                MeterName = meter.Name,
                Status = meter.IsActive ? "online" : "offline",
                ResponseTimeMs = stopwatch.ElapsedMilliseconds
            };
        }
        finally
        {
            _pingSemaphore.Release();
        }
        
    }

    public async IAsyncEnumerable<MeterPingResult> PingAllMetersConcurrentlyAsync(List<MeterInfo> meters,[EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        
        var tasks = new List<Task<MeterPingResult>>();

        foreach (var meter in meters)
        {
            tasks.Add(PingMeterAsync(meter, cancellationToken));
        }

        while (tasks.Count > 0)
        {
            var completedTask = await Task.WhenAny(tasks);
            tasks.Remove(completedTask);
            yield return await completedTask;
        }
    }

    public async Task<(List<MeterPingResult> Results, MeterPingResult FirstCompleted)>PingMetersWithChannelAsync(List<MeterInfo> meters, CancellationToken cancellationToken = default)
    {
        var channel =  Channel.CreateBounded<MeterInfo>(50);
        var results = new ConcurrentBag<MeterPingResult>();

        var firstCompletedResult = new TaskCompletionSource<MeterPingResult>(TaskCreationOptions
            .RunContinuationsAsynchronously);

        async Task ProduceMetersAsync()
        {
            try
            {
                foreach (var meter in meters)
                {
                    await channel.Writer.WriteAsync(meter, cancellationToken);
                }
            }
            finally
            {
                channel.Writer.TryComplete();
            }
        }

        async Task ConsumeMeterAsync()
        {
            await foreach (var meter in channel.Reader.ReadAllAsync(cancellationToken))
            {
                var result = await PingMeterAsync(meter, cancellationToken);
                firstCompletedResult.TrySetResult(result);
                results.Add(result);
            }
        }

        var consumerTask = Enumerable.Range(0,50)
            .Select(_ => ConsumeMeterAsync())
            .ToArray();

        var producerTask = ProduceMetersAsync();

        await Task.WhenAll(consumerTask.Append(producerTask));

        return (results.OrderBy(result => result.MeterId).ToList(),await firstCompletedResult.Task);
    }
}