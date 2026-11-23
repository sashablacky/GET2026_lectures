using Lecture9Api.Models;
using Lecture9Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperimentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExperimentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("eager")]
    public async Task<IActionResult> Eager()
    {
        var meters = await _context.MeterInfos
            .Include(m => m.CommandLogs)
            .ToListAsync();

        return Ok(meters.Select(m => new
        {
            m.Id,
            m.MeterNumber,
            LogCount = m.CommandLogs.Count,
            Logs = m.CommandLogs.Select(c => new { c.Id, c.Command, c.Status })
        }));
    }

    [HttpGet("explicit/{id:int}")]
    public async Task<IActionResult> Explicit(int id)
    {
        // Query 1: load only the meter, no logs
        var meter = await _context.MeterInfos.FindAsync(id);
        if (meter is null)
        {
            return NotFound();
        }

        var logsEntry = _context.Entry(meter).Collection(m => m.CommandLogs);
        var loadedBefore = logsEntry.IsLoaded;

        // Query 2: load logs only now, because we explicitly asked
        await logsEntry.LoadAsync();

        return Ok(new
        {
            meter.Id,
            meter.MeterNumber,
            LoadedBefore = loadedBefore,
            LoadedAfter = logsEntry.IsLoaded,
            LogCount = meter.CommandLogs.Count
        });
    }

    [HttpGet("lazy/{id:int}")]
    public async Task<IActionResult> Lazy(int id)
    {
        // Only the meter is loaded: no Include, no LoadAsync
        var meter = await _context.MeterInfos.FirstOrDefaultAsync(m => m.Id == id);
        if (meter is null)
        {
            return NotFound();
        }

        // With lazy loading ON, this line silently sends a second SQL query
        var logCount = meter.CommandLogs.Count;

        return Ok(new
        {
            meter.Id,
            meter.MeterNumber,
            EntityType = meter.GetType().Name,
            LogCount = logCount
        });
    }
    [HttpPost("seed")]
    public async Task<IActionResult> Seed([FromServices] IWebHostEnvironment env)
    {
        if (!env.IsDevelopment())
        {
            return NotFound();
        }

        if (await _context.MeterInfos.AnyAsync(m => m.MeterNumber.StartsWith("SEED-")))
        {
            return Conflict("Seed data already exists.");
        }

        var locations = new[] { "Tallinn", "Tartu", "Narva", "Parnu" };
        var commands = new[] { "ReadNow", "Restart", "Sync", "Ping" };
        var statuses = new[] { CommandStatus.Completed, CommandStatus.Failed, CommandStatus.Pending };
        var now = DateTime.UtcNow;
        var totalLogs = 0;

        for (var i = 1; i <= 12; i++)
        {
            var meter = new MeterInfo
            {
                MeterNumber = $"SEED-{i:D3}",
                Location = locations[i % locations.Length],
                Status = i % 5 == 0 ? MeterStatus.Inactive : MeterStatus.Active
            };

            
            if (i < 12)
            {
                var logCount = 2 + i % 4;   
                for (var j = 0; j < logCount; j++)
                {
                    meter.CommandLogs.Add(new CommandLog
                    {
                        Command = commands[(i + j) % commands.Length],
                        Status = statuses[(i + j) % statuses.Length],
                        CreatedAt = now.AddMinutes(-(i * 10 + j))   
                    });
                    totalLogs++;
                }
            }

            _context.MeterInfos.Add(meter);
        }

        await _context.SaveChangesAsync();

        return Ok(new { MetersCreated = 12, LogsCreated = totalLogs });
    }

    [HttpGet("n-plus-one")]
    public async Task<IActionResult> NPlusOne([FromServices] SqlCounter counter)
    {
        counter.Reset();

        var meters = await _context.MeterInfos.OrderBy(m => m.Id).ToListAsync();

        var result = new List<object>();
        foreach (var meter in meters)
        {
            result.Add(new
            {
                meter.Id,
                meter.MeterNumber,
                CommandCount = meter.CommandLogs.Count
            });
        }

        return Ok(new
        {
            LazyLoadingEnabled = meters.FirstOrDefault()?.GetType().Name.EndsWith("Proxy"),
            Meters = meters.Count,
            SqlCommands = counter.Count,
            Result = result
        });
    }

    [HttpGet("n-plus-one/include")]
    public async Task<IActionResult> NPlusOneFixedWithInclude([FromServices] SqlCounter counter)
    {
        counter.Reset();

        var meters = await _context.MeterInfos
            .Include(m => m.CommandLogs)
            .OrderBy(m => m.Id)
            .ToListAsync();
        
        var result = new List<object>();
        foreach (var meter in meters)
        {
            result.Add(new
            {
                meter.Id,
                meter.MeterNumber,
                CommandCount = meter.CommandLogs.Count
            });
        }

        return Ok(new
        {
            LazyLoadingEnabled = meters.FirstOrDefault()?.GetType().Name.EndsWith("Proxy"),
            Meters = meters.Count,
            SqlCommands = counter.Count,
            Result = result
        });
    }

    [HttpGet("compiled/{id:int}")]
    public async Task<IActionResult> CompiledById(int id)
    {
        var meter = await CompiledQueries.GetMeterById(_context, id);
        if (meter is null)
        {
            return NotFound();
        }

        return Ok(new { meter.Id, meter.MeterNumber, meter.Location, meter.Status });
    }

    [HttpGet("compiled/location/{location}")]
    public async Task<IActionResult> CompiledByLocation(string location)
    {
        var result = new List<object>();
        await foreach (var meter in CompiledQueries.GetMetersByLocation(_context, location))
        {
            result.Add(new { meter.Id, meter.MeterNumber, meter.Location, meter.Status });
        }

        return Ok(result);
    }


}
