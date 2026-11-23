using Lecture9Api.Models;

namespace Lecture9Api.DTOs;

public class MeterHistoryDto
{
    public int MeterInfoId { get; set; }
    public string MeterNumber { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int CommandCount { get; set; }
    public string? LatestCommand { get; set; }
    public CommandStatus? LatestCommandStatus { get; set; }
    public DateTime? LatestCommandDate { get; set; }
}
