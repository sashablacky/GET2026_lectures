using System.ComponentModel.DataAnnotations;
using Lecture9Api.Models;

namespace Lecture9Api.DTOs;

public record MeterReadingDto(int Id, int MeterInfoId, decimal Reading, DateTime RecordedAt);

public class CreateMeterReadingDto
{
    [Range(1, int.MaxValue)]
    public int MeterInfoId { get; set; }

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal Reading { get; set; }
}
