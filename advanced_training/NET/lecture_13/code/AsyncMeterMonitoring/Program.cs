using System.Threading.RateLimiting;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using AsyncMeterInfoMonitoring.Models;
using AsyncMeterInfoMonitoring.Services;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddTokenBucketLimiter("PingPolicy", limiter =>
    {
        limiter.TokenLimit = 100;
        limiter.TokensPerPeriod = 50;
        limiter.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        limiter.QueueLimit = 0;
        limiter.AutoReplenishment = true;
    });
});

builder.Services.AddSingleton<MeterPingService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRateLimiter();

var meters = Enumerable.Range(1, 1_000)
    .Select(id => new MeterInfo
    {
        Id = id,
        Name = $"M-{id:D4}",
        IsActive = Random.Shared.Next(2) == 1
    })
    .ToList();

app.MapGet("/api/meters", () =>
{  
    return Results.Ok(meters);
});
app.MapPost("/api/meters/monitor", async (MeterPingService service, CancellationToken cancellationToken) =>
{
    var totalStopwatch = Stopwatch.StartNew();

    try
    {
        var pingSummary = await service.PingMetersWithChannelAsync(meters, cancellationToken);

        totalStopwatch.Stop();

        return Results.Ok(new
        {
            FirstCompletedMeter = pingSummary.FirstCompleted.MeterName,
            TotalExecutionTimeMs = totalStopwatch.ElapsedMilliseconds,
            Results = pingSummary.Results
        });
    }
    catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
    {
        return Results.StatusCode(499);
    }
});
app.MapPost("/api/meters/{id:int}/ping", async (int id, MeterPingService service, CancellationToken cancellationToken) =>
{
    var meter = meters.SingleOrDefault(m => m.Id == id);
    if (meter is null)
    {
        return Results.NotFound();
    }

    var result = await service.PingMeterAsync(meter, cancellationToken);
    return Results.Ok(result);
}).RequireRateLimiting("PingPolicy");


app.Run();
