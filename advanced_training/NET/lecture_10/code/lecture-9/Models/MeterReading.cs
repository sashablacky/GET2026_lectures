using System.ComponentModel.DataAnnotations;

namespace Lecture9Api.Models;

public class MeterReading
{
    public int Id { get; set; }

    [Range(1, int.MaxValue)]
    public int MeterInfoId { get; set; }

    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    public decimal Reading { get; set; }

    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public virtual MeterInfo? MeterInfo { get; set; }
}
