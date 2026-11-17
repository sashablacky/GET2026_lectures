using System.ComponentModel.DataAnnotations;

namespace MeterInfoApi.Models;

public class MeterInfo
{
    public int Id { get; set; }

    /// <summary>The meter's serial number.</summary>
    /// <example>MTR-123456</example>
    [Required(ErrorMessage = "Serial number is required.")]
    [RegularExpression(@"\AMTR-[0-9]{6}\z", ErrorMessage = "Serial number must follow the format MTR-123456.")]
    public string SerialNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Meter name is required.")]
    [MinLength(3, ErrorMessage = "Meter name must contain at least 3 characters.")]
    public string MeterName { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "100000", ErrorMessage = "Reading must be between 0 and 100000.")]
    public decimal Reading { get; set; }

    [Required(ErrorMessage = "Meter type is required.")]
    public string MeterType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Installation date is required.")]
    [NotInFuture(ErrorMessage = "Installation date cannot be in the future.")]
    public DateTime? InstallationDate { get; set; }

    [EmailAddress(ErrorMessage = "Email must have a valid format.")]
    public string? Email { get; set; }
}
