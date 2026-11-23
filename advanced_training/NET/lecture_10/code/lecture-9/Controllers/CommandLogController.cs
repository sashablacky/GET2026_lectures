using Lecture9Api.Models;
using Lecture9Api.Data;
using Lecture9Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lecture9Api.Repositories;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommandLogController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public CommandLogController(ApplicationDbContext context, IUnitOfWork unitOfWork)
    {
        _context = context;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<ActionResult<CommandLogDto>> CreateLog(CreateCommandLogDto dto)
    {
        if(!await _context.MeterInfos.AnyAsync(m => m.Id == dto.MeterInfoId))
        {
            return NotFound($"Meter {dto.MeterInfoId} not found");
        }

        var log = new CommandLog
        {
            MeterInfoId = dto.MeterInfoId,
            Command = dto.Command,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.CommandLog.AddAsync(log);
        await _unitOfWork.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLog), new {id = log.Id}, ToDto(log));
    }

    [HttpGet]
    public async Task<ActionResult<List<CommandLogDto>>> GetLogs()
    {
        var logs = await _unitOfWork.CommandLog.GetAllAsync();
        return logs.Select(ToDto).ToList();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CommandLogDto>> GetLog(int id)
    {
        var log = await _context.CommandLogs.FindAsync(id);
        if (log is null)
        {
            return NotFound();
        }
        return Ok(ToDto(log));
    }

    [HttpGet("meter/{meterId:int}")]
    public async Task<ActionResult<List<CommandLogDto>>> GetLogsByMeter(int meterId)
    {
        if(!await _context.MeterInfos.AnyAsync(m => m.Id == meterId))
        {
            return NotFound($"Meter with ID: {meterId} not found");
        }

        return await _context.CommandLogs
            .Where(c => c.MeterInfoId == meterId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommandLogDto(c.Id, c.MeterInfoId, c.Command, c.Status, c.CreatedAt))
            .ToListAsync();
    }

    private static CommandLogDto ToDto(CommandLog c) =>
        new(c.Id, c.MeterInfoId, c.Command, c.Status, c.CreatedAt);
}