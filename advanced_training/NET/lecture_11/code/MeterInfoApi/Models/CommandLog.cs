using System.ComponentModel.DataAnnotations;

namespace Lecture9Api.Models;

public class CommandLog
{    
    public int Id{get;set;}
    public int MeterInfoId{get;set;}
    [Required]
    [MaxLength(100)]
    public string Command{get;set;} = string.Empty;
    public DateTime CreatedAt{get;set;}
    public CommandStatus Status{get;set;} = CommandStatus.Pending;
    public virtual MeterInfo? MeterInfo { get; set; }
}