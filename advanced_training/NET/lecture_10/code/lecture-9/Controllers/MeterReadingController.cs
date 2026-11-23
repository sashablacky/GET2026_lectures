using Lecture9Api.Data;
using Lecture9Api.DTOs;
using Lecture9Api.Models;
using Lecture9Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeterReadingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public MeterReadingController(ApplicationDbContext context, IUnitOfWork unitOfWork)
    {
        _context = context;
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<ActionResult<MeterReadingDto>> Create(CreateMeterReadingDto dto)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var meter = await _unitOfWork.MeterInfo.GetByIdAsync(dto.MeterInfoId);
            if (meter is null)
            {
                return NotFound($"Meter {dto.MeterInfoId} not found");
            }

            var reading = new MeterReading
            {
                MeterInfoId = dto.MeterInfoId,
                Reading = dto.Reading,
                RecordedAt = DateTime.UtcNow
            };
            await _unitOfWork.MeterReading.AddAsync(reading);
            await _unitOfWork.CommandLog.AddAsync(new CommandLog
            {
                MeterInfoId = dto.MeterInfoId,
                Command = "Reading",
                Status = CommandStatus.Completed,
                CreatedAt = DateTime.UtcNow
            });

            await _unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return CreatedAtAction(nameof(GetLatest), new { meterId = dto.MeterInfoId }, ToDto(reading));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpGet("{meterId:int}")]
    public async Task<ActionResult<List<MeterReadingDto>>> GetReadings(int meterId)
    {
        var meter = await _unitOfWork.MeterInfo.GetByIdAsync(meterId);
        if (meter is null) return NotFound();
        var readings = await _unitOfWork.MeterReading.GetByMeterAsync(meterId);
        return readings.Select(ToDto).ToList();
    }

    [HttpGet("{meterId:int}/latest")]
    public async Task<ActionResult<MeterReadingDto>> GetLatest(int meterId)
    {
        var reading = await _unitOfWork.MeterReading.GetLatestAsync(meterId);
        return reading is null ? NotFound() : Ok(ToDto(reading));
    }

    [HttpGet("{meterId:int}/range")]
    public async Task<ActionResult<List<MeterReadingDto>>> GetRange(
        int meterId,
        [FromQuery] DateTime start,
        [FromQuery] DateTime end)
    {
        if (end < start) return BadRequest("End must not be earlier than start.");
        var meter = await _unitOfWork.MeterInfo.GetByIdAsync(meterId);
        if (meter is null) return NotFound();

        var readings = await _unitOfWork.MeterReading.GetInRangeAsync(
            meterId,
            start.ToUniversalTime(),
            end.ToUniversalTime());
        return readings.Select(ToDto).ToList();
    }

    private static MeterReadingDto ToDto(MeterReading reading) =>
        new(reading.Id, reading.MeterInfoId, reading.Reading, reading.RecordedAt);
}
