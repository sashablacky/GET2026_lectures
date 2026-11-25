namespace AsyncMeterMonitoring.Models;

public class MeterPingResult
{
    public int MeterId { get; set; }
    public string MeterName { get; set; } = string.Empty;
    public bool IsOnline { get; set; }
    public long ResponseTimeMs { get; set; }
}