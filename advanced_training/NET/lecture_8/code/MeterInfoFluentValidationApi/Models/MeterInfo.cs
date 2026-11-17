namespace MeterInfoFluentValidationApi.Models;

public class MeterInfo
{
    public int Id { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string MeterName { get; set; } = string.Empty;
    public decimal Reading { get; set; }
    public string MeterType { get; set; } = string.Empty;
    public DateTime? InstallationDate { get; set; }
    public string? Email { get; set; }
}
