namespace Lecture9Api.DTOs;

public class MeterSummaryDto
{
    public int MeterInfoId { get; set; }
    public string MeterNumber { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int TotalCommandCount { get; set; }
    public int CompletedCommandCount { get; set; }
    public int FailedCommandCount { get; set; }
    public DateTime? LastCommandDate { get; set; }
}
