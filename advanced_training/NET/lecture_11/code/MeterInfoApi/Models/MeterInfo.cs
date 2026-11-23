using System.ComponentModel.DataAnnotations;

namespace Lecture9Api.Models;

public class MeterInfo
{
    public int Id{get;set;}
    [Required]
    [MaxLength(50)]
    public string MeterNumber{get;set;} = string.Empty;    
    [Required]
    [MaxLength(100)]
    public string Location{get;set;} = string.Empty;
    public MeterStatus Status{get;set;} = MeterStatus.Active;
    public virtual ICollection<CommandLog> CommandLogs { get; set; } = new List<CommandLog>();
    public virtual ICollection<MeterReading> MeterReadings { get; set; } = new List<MeterReading>();
}