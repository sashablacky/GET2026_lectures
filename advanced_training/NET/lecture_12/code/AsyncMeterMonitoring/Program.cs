using System.Diagnostics;
using AsyncMeterMonitoring.Models;
using AsyncMeterMonitoring.Services;

var meters = new List<MeterInfo>
{
    new() { Id = 1, Name = "Meter A", IpAddress = "192.168.1.101" },
    new() { Id = 2, Name = "Meter B", IpAddress = "192.168.1.102" },
    new() { Id = 3, Name = "Meter C", IpAddress = "192.168.1.103" }
};

var service = new MeterPingService();

Console.WriteLine("Sequential:");
var sequentialStopwatch = Stopwatch.StartNew();

await foreach (var result in service.PingAllMetersAsync(meters))
{
    Console.WriteLine(
        $"{result.MeterName}: {(result.IsOnline ? "ONLINE" : "OFFLINE")}, " +
        $"{result.ResponseTimeMs} ms");
}

sequentialStopwatch.Stop();
Console.WriteLine($"Sequential elapsed: {sequentialStopwatch.ElapsedMilliseconds} ms");

Console.WriteLine("\nConcurrent:");
var concurrentStopwatch = Stopwatch.StartNew();

await foreach (var result in service.PingAllMetersConcurrentlyAsync(meters))
{
    Console.WriteLine(
        $"{result.MeterName}: {(result.IsOnline ? "ONLINE" : "OFFLINE")}, " +
        $"{result.ResponseTimeMs} ms");
}

concurrentStopwatch.Stop();
Console.WriteLine($"Concurrent elapsed: {concurrentStopwatch.ElapsedMilliseconds} ms");