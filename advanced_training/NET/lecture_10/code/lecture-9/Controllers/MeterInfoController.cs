using Lecture9Api.Data;
using Lecture9Api.Models;
using Lecture9Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lecture9Api.Repositories;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeterInfoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public MeterInfoController(ApplicationDbContext context, IUnitOfWork unitOfWork)
    {
        _context = context;
        _unitOfWork = unitOfWork;
    }

    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        var canConnect = await _context.Database.CanConnectAsync();
        return Ok(new { canConnect });
    }

    [HttpPost]
    public async Task<ActionResult<MeterInfoDto>> CreateMeter(CreateMeterInfoDto dto)
    {
        if(await _context.MeterInfos.AnyAsync(m => m.MeterNumber == dto.MeterNumber))
        {
            return Conflict($"Meter '{dto.MeterNumber}' already exists.");
        }

        var meter = new MeterInfo
        {
            MeterNumber = dto.MeterNumber,
            Location = dto.Location,
            Status = dto.Status
        };

        await _unitOfWork.MeterInfo.AddAsync(meter);
        await _unitOfWork.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMeter), new {id = meter.Id}, ToDto(meter));
    }

    [HttpGet]
    public async Task<ActionResult<List<MeterInfoDto>>> GetMeters()
    {
        var meters = await _unitOfWork.MeterInfo.GetAllAsync();
        return meters.Select(m => new MeterInfoDto(m.Id, m.MeterNumber, m.Location, m.Status)).ToList();
    }

    [HttpGet("summary")]
    public async Task<ActionResult<List<MeterSummaryDto>>> GetSummary()
    {
        return await _context.MeterInfos
            .OrderBy(m => m.Id)
            .Select(m => new MeterSummaryDto
            {
                MeterInfoId = m.Id,
                MeterNumber = m.MeterNumber,
                Location = m.Location,
                TotalCommandCount = m.CommandLogs.Count(),
                CompletedCommandCount = m.CommandLogs.Count(c => c.Status == CommandStatus.Completed),
                FailedCommandCount = m.CommandLogs.Count(c => c.Status == CommandStatus.Failed),
                LastCommandDate = m.CommandLogs.Max(c => (DateTime?)c.CreatedAt)
            })
            .ToListAsync();
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<MeterHistoryDto>>> GetHistory()
    {
        return await _context.MeterInfos
            .OrderBy(m => m.Id)
            .Select(m => new MeterHistoryDto
            {
                MeterInfoId = m.Id,
                MeterNumber = m.MeterNumber,
                Location = m.Location,
                CommandCount = m.CommandLogs.Count(),

                LatestCommand = m.CommandLogs
                    .OrderByDescending(c => c.CreatedAt).ThenByDescending(c => c.Id)
                    .Select(c => c.Command)
                    .FirstOrDefault(),

                LatestCommandStatus = m.CommandLogs
                    .OrderByDescending(c => c.CreatedAt).ThenByDescending(c => c.Id)
                    .Select(c => (CommandStatus?)c.Status)
                    .FirstOrDefault(),

                LatestCommandDate = m.CommandLogs.Max(c => (DateTime?)c.CreatedAt)
            })
            .ToListAsync();
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<MeterInfoDto>> GetMeter(int id)
    {
        var meter = await _unitOfWork.MeterInfo.GetByIdAsync(id);
        if (meter is null)
        {
            return NotFound();
        }
        return Ok(ToDto(meter));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MeterInfoDto>> UpdateMeter(UpdateMeterInfoDto dto, int id)
    {
        var meter = await _unitOfWork.MeterInfo.GetByIdAsync(id);
        if (meter is null)
        {
            return NotFound();
        }
        if(await _context.MeterInfos.AnyAsync(m => m.MeterNumber == dto.MeterNumber && m.Id != id))
        {
            return Conflict($"Meter '{dto.MeterNumber}' already exists.");
        }
        meter.MeterNumber = dto.MeterNumber;
        meter.Location = dto.Location;
        meter.Status = dto.Status;

        await _unitOfWork.SaveChangesAsync();

        return Ok(ToDto(meter));
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteMeter(int id)
    {
        var meter = await _unitOfWork.MeterInfo.GetByIdAsync(id);
        if(meter is null)
        {
            return NotFound();
        }

        if(await _context.CommandLogs.AnyAsync(c => c.MeterInfoId == id))
        {
            return Conflict("Meter has command logs and cannot be deleted");
        }
        _unitOfWork.MeterInfo.Delete(meter);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }  
    [HttpGet("location/{location}")]
    public async Task<ActionResult<List<MeterInfoDto>>> GetByLocation(string location)
    {
        var meters = await _unitOfWork.MeterInfo.GetByLocationAsync(location);
        return meters.Select(m => ToDto(m)).ToList();
    }

    [HttpGet("status/{status}")]
    public async Task<ActionResult<List<MeterInfoDto>>> GetByStatus(MeterStatus status)
    {
        var meters = await _unitOfWork.MeterInfo.GetByStatusAsync(status);
        return meters.Select(m => ToDto(m)).ToList();
    }

    [HttpPost("{id:int}/deactivate")]
    public async Task<ActionResult<MeterInfoDto>> Deactivate(int id)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var meter = await _unitOfWork.MeterInfo.GetByIdAsync(id);
            if (meter is null)
            {
                return NotFound();
            }

            meter.Status = MeterStatus.Inactive;
            _unitOfWork.MeterInfo.Update(meter);
            await _unitOfWork.CommandLog.AddAsync(new CommandLog
            {
                MeterInfoId = id,
                Command = "Deactivate",
                Status = CommandStatus.Completed,
                CreatedAt = DateTime.UtcNow
            });

            await _unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Ok(ToDto(meter));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    private static MeterInfoDto ToDto(MeterInfo m) => new(m.Id, m.MeterNumber, m.Location, m.Status);
}