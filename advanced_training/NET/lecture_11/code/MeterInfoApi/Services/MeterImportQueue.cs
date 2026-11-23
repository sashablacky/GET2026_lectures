using System.Threading.Channels;

namespace Lecture9Api.Services;

public sealed class MeterImportQueue
{
    private readonly Channel<Guid> _channel =
        Channel.CreateUnbounded<Guid>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });

    public ValueTask<Guid> DequeueAsync(CancellationToken cancellationToken) =>
        ReadAsync(cancellationToken);

    public ValueTask EnqueueAsync(Guid jobId, CancellationToken cancellationToken = default) =>
        _channel.Writer.WriteAsync(jobId, cancellationToken);

    private async ValueTask<Guid> ReadAsync(CancellationToken cancellationToken)
    {
        await _channel.Reader.WaitToReadAsync(cancellationToken);
        return await _channel.Reader.ReadAsync(cancellationToken);
    }
}
