using System.ComponentModel.DataAnnotations;
using Lecture9Api.Models;

namespace Lecture9Api.DTOs;

public record CommandLogDto(int Id, int MeterInfoId, string Command, CommandStatus Status, DateTime CreatedAt);

public class CreateCommandLogDto
{
    [Range(1, int.MaxValue)]
    public int MeterInfoId { get; set; }

    [Required, StringLength(100)]
    public string Command { get; set; } = string.Empty;

    public CommandStatus Status { get; set; } = CommandStatus.Pending;
}