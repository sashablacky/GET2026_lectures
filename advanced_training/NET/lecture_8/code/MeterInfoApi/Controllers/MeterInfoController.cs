using MeterInfoApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace MeterInfoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeterInfoController : ControllerBase
{
    private static readonly List<MeterInfo> MeterInfos = new()
    {
        new MeterInfo
        {
            Id = 1,
            SerialNumber = "MTR-123456",
            MeterName = "Main Building Meter",
            Reading = 1250.5m,
            MeterType = "Electric",
            InstallationDate = new DateTime(2022, 4, 12),
            Email = "facilities@example.com"
        },
        new MeterInfo
        {
            Id = 2,
            SerialNumber = "MTR-234567",
            MeterName = "Water Meter",
            Reading = 824.75m,
            MeterType = "Water",
            InstallationDate = new DateTime(2023, 8, 3),
            Email = "maintenance@example.com"
        },
        new MeterInfo
        {
            Id = 3,
            SerialNumber = "MTR-345678",
            MeterName = "Backup Gas Meter",
            Reading = 92m,
            MeterType = "Gas",
            InstallationDate = new DateTime(2021, 11, 20)
        }
    };

    private static int _nextId = 4;

    /// <summary>Gets all meters.</summary>
    /// <response code="200">Returns all meters.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MeterInfo>), StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<MeterInfo>> GetAll()
    {
        return Ok(MeterInfos);
    }

    [HttpGet("{id:int}")]
    public ActionResult<MeterInfo> GetById(int id)
    {
        MeterInfo? meterInfo = MeterInfos.FirstOrDefault(meter => meter.Id == id);

        if (meterInfo is null)
        {
            return NotFound();
        }

        return Ok(meterInfo);
    }

    [HttpPost]
    public ActionResult<MeterInfo> Create([FromBody] MeterInfo meterInfo)
    {
        meterInfo.Id = _nextId++;
        MeterInfos.Add(meterInfo);

        return CreatedAtAction(nameof(GetById), new { id = meterInfo.Id }, meterInfo);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] MeterInfo updatedMeterInfo)
    {
        MeterInfo? meterInfo = MeterInfos.FirstOrDefault(meter => meter.Id == id);

        if (meterInfo is null)
        {
            return NotFound();
        }

        meterInfo.SerialNumber = updatedMeterInfo.SerialNumber;
        meterInfo.MeterName = updatedMeterInfo.MeterName;
        meterInfo.Reading = updatedMeterInfo.Reading;
        meterInfo.MeterType = updatedMeterInfo.MeterType;
        meterInfo.InstallationDate = updatedMeterInfo.InstallationDate;
        meterInfo.Email = updatedMeterInfo.Email;

        return Ok(meterInfo);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        MeterInfo? meterInfo = MeterInfos.FirstOrDefault(meter => meter.Id == id);

        if (meterInfo is null)
        {
            return NotFound();
        }

        MeterInfos.Remove(meterInfo);
        return NoContent();
    }
}
