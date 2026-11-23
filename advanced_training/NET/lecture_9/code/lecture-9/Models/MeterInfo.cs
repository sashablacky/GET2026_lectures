using System.ComponentModel.DataAnnotations;

namespace Lecture9Api.Models;

public class MeterInfo
{
    // Id (int), SerialNumber (string), CurrentReading (decimal), CreatedAt (DateTime), Location (string?)
    public int Id{get;set;}
    public string SerialNumber{get;set;} = string.Empty;
    public decimal CurrentReading{get;set;}
    public DateTime CreatedAt{get;set;}
    public string? Location{get;set;}
    public DateTime InstallationDate{get;set;}
    public ICollection<CommandLog> CommandLogs { get; set; } = new List<CommandLog>();
}