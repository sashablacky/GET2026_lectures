using Lecture9Api.Services;

namespace Lecture9Api.Services;

public sealed class MeterImportWorker : BackgroundService
{
    private readonly MeterImportQueue _queue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MeterImportWorker> _logger;

    public MeterImportWorker(
        MeterImportQueue queue,
        IServiceScopeFactory scopeFactory,
        ILogger<MeterImportWorker> logger)
    {
        _queue = queue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var jobId = await _queue.DequeueAsync(stoppingToken);
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var importer = scope.ServiceProvider.GetRequiredService<IMeterImportService>();
                await importer.ProcessJobAsync(jobId, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected failure while processing import job {JobId}", jobId);
            }
        }
    }
}
