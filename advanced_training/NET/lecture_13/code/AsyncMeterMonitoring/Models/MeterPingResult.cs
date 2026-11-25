namespace AsyncMeterInfoMonitoring.Models;

public class MeterPingResult
{
    public int MeterId { get; set; }
    public string MeterName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double ResponseTimeMs { get; set; }
}