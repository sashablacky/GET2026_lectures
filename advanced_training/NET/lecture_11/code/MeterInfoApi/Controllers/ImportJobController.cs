using Lecture9Api.Data;
using Lecture9Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportJobController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ImportJobController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ImportJob>> Get(Guid id, CancellationToken cancellationToken)
    {
        var job = await _context.ImportJobs.AsNoTracking()
            .SingleOrDefaultAsync(j => j.Id == id, cancellationToken);
        return job is null ? NotFound() : Ok(job);
    }

    [HttpGet]
    public async Task<ActionResult<List<ImportJob>>> GetAll(CancellationToken cancellationToken)
    {
        var jobs = await _context.ImportJobs.AsNoTracking()
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync(cancellationToken);
        return Ok(jobs);
    }
}
