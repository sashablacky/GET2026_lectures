using Lecture9Api.Models;
using Lecture9Api.Data;
using Lecture9Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lecture9Api.Repositories;
using Lecture9Api.Caching;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommandLogController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICachedMeterService _cacheService;

    public CommandLogController(
        ApplicationDbContext context,
        IUnitOfWork unitOfWork,
        ICachedMeterService cacheService)
    {
        _context = context;
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
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
    public async Task<ActionResult<List<CommandLogDto>>> GetLogsByMeter(
        int meterId,
        CancellationToken cancellationToken)
    {
        if(!await _context.MeterInfos.AnyAsync(m => m.Id == meterId, cancellationToken))
        {
            return NotFound($"Meter with ID: {meterId} not found");
        }

        return await _cacheService.GetCommandLogsAsync(meterId, cancellationToken);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CommandLogDto>> UpdateLog(
        int id,
        CreateCommandLogDto dto,
        CancellationToken cancellationToken)
    {
        var log = await _context.CommandLogs.FindAsync([id], cancellationToken);
        if (log is null)
            return NotFound();

        if (!await _context.MeterInfos.AnyAsync(m => m.Id == dto.MeterInfoId, cancellationToken))
            return NotFound($"Meter {dto.MeterInfoId} not found");

        var oldMeterId = log.MeterInfoId;
        log.MeterInfoId = dto.MeterInfoId;
        log.Command = dto.Command;
        log.Status = dto.Status;
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Ok(ToDto(log));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteLog(int id, CancellationToken cancellationToken)
    {
        var log = await _context.CommandLogs.FindAsync([id], cancellationToken);
        if (log is null)
            return NotFound();

        _unitOfWork.CommandLog.Delete(log);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static CommandLogDto ToDto(CommandLog c) =>
        new(c.Id, c.MeterInfoId, c.Command, c.Status, c.CreatedAt);
}