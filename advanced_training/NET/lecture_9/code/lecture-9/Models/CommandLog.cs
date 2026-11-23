using System.ComponentModel.DataAnnotations;

namespace Lecture9Api.Models;

public class CommandLog
{
    [Required]
    public int Id{get;set;}
    [Required]
    public int MeterInfoId{get;set;}
    [Required]
    [MaxLength(100)]
    public string CommandName{get;set;} = string.Empty;
    [Required]
    public DateTime ExecutedAt{get;set;}
    [Required]
    [MaxLength(50)]
    public string Status{get;set;} = string.Empty;
    public MeterInfo MeterInfo { get; set; } = null!;
}