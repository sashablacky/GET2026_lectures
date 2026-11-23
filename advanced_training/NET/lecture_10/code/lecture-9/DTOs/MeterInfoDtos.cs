using System.ComponentModel.DataAnnotations;
using Lecture9Api.Models;

namespace Lecture9Api.DTOs;

public record MeterInfoDto(int Id, string MeterNumber, string Location, MeterStatus Status);

public class CreateMeterInfoDto
{
    [Required, StringLength(50)]
    public string MeterNumber{get;set;} = string.Empty;
    [Required, StringLength(100)]
    public string Location{get;set;} = string.Empty;
    public MeterStatus Status{get;set;} = MeterStatus.Active;
}

public class UpdateMeterInfoDto
{
    [Required, StringLength(50)]
    public string MeterNumber{get;set;} = string.Empty;
    [Required, StringLength(100)]
    public string Location{get;set;} = string.Empty;
    public MeterStatus Status{get;set;}
}