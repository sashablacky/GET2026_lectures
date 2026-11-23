using Lecture9Api.Data;
using Lecture9Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeterInfoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MeterInfoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        var canConnect = await _context.Database.CanConnectAsync();
        return Ok(new { canConnect });
    }

    [HttpPost]
    public async Task<ActionResult<MeterInfo>> CreateMeter([FromBody] MeterInfo newMeter)
    {
        _context.MeterInfos.Add(newMeter);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMeter),
            new { id = newMeter.Id },
            newMeter);
    }

    [HttpGet]
    public async Task<ActionResult<List<MeterInfo>>> GetMeters()
    {
        return await _context.MeterInfos.ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MeterInfo>> GetMeter(int Id)
    {
        var meter = await _context.MeterInfos.FindAsync(Id);
        if (meter is null)
        {
            return NotFound();
        }
        return Ok(meter);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MeterInfo>> UpdateMeter([FromBody] MeterInfo updMeter, int Id)
    {
        var meter = await _context.MeterInfos.FindAsync(Id);
        if (meter is null)
        {
            return NotFound();
        }
        meter.SerialNumber = updMeter.SerialNumber;
        meter.CurrentReading = updMeter.CurrentReading;
        meter.CreatedAt = updMeter.CreatedAt;
        meter.Location = updMeter.Location;

        await _context.SaveChangesAsync();

        return Ok(meter);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteMeter(int Id)
    {
        var meter = await _context.MeterInfos.FindAsync(Id);
        if(meter is null)
        {
            return NotFound();
        }

        _context.MeterInfos.Remove(meter);
        await _context.SaveChangesAsync();

        return Ok();
    }  
}