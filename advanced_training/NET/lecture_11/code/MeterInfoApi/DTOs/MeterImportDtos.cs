using System.ComponentModel.DataAnnotations;
using Lecture9Api.Models;

namespace Lecture9Api.DTOs;

public sealed record ImportValidationError(int RecordNumber, string Message);

public sealed record MeterImportSummary(
    int TotalRecords,
    int SuccessfullyInserted,
    int RejectedRecords,
    IReadOnlyList<ImportValidationError> Errors);

public sealed class MeterImportDto
{
    [MaxLength(50)]
    public string MeterNumber { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
