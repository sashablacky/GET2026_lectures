using FluentValidation;
using MeterInfoFluentValidationApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace MeterInfoFluentValidationApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeterInfoController : ControllerBase
{
    private readonly IValidator<MeterInfo> _validator;

    private static readonly List<MeterInfo> MeterInfos = new()
    {
        new MeterInfo
        {
            Id = 1,
            SerialNumber = "MTR-123456",
            MeterName = "Main Building Meter",
            Reading = 1250.5m,
            MeterType = "Commercial",
            InstallationDate = new DateTime(2022, 4, 12),
            Email = "facilities@example.com"
        },
        new MeterInfo
        {
            Id = 2,
            SerialNumber = "MTR-234567",
            MeterName = "Water Meter",
            Reading = 824.75m,
            MeterType = "Domestic",
            InstallationDate = new DateTime(2023, 8, 3),
            Email = "maintenance@example.com"
        },
        new MeterInfo
        {
            Id = 3,
            SerialNumber = "MTR-345678",
            MeterName = "Backup Gas Meter",
            Reading = 92m,
            MeterType = "Domestic",
            InstallationDate = new DateTime(2021, 11, 20)
        }
    };

    private static int _nextId = 4;

    public MeterInfoController(IValidator<MeterInfo> validator)
    {
        _validator = validator;
    }

    [HttpGet]
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
            return MeterNotFound(id);
        }

        return Ok(meterInfo);
    }

    [HttpPost]
    public async Task<ActionResult<MeterInfo>> Create(
        [FromBody] MeterInfo meterInfo,
        CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(meterInfo, cancellationToken);
        if (!validationResult.IsValid)
        {
            AddValidationErrors(validationResult);
            return MeterValidationProblem();
        }

        meterInfo.Id = _nextId++;
        MeterInfos.Add(meterInfo);

        return CreatedAtAction(nameof(GetById), new { id = meterInfo.Id }, meterInfo);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] MeterInfo updatedMeterInfo,
        CancellationToken cancellationToken)
    {
        MeterInfo? meterInfo = MeterInfos.FirstOrDefault(meter => meter.Id == id);

        if (meterInfo is null)
        {
            return MeterNotFound(id);
        }

        var validationResult = await _validator.ValidateAsync(updatedMeterInfo, cancellationToken);
        if (!validationResult.IsValid)
        {
            AddValidationErrors(validationResult);
            return MeterValidationProblem();
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
            return MeterNotFound(id);
        }

        MeterInfos.Remove(meterInfo);
        return NoContent();
    }

    private void AddValidationErrors(FluentValidation.Results.ValidationResult validationResult)
    {
        foreach (var error in validationResult.Errors)
        {
            ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
        }
    }

    private ObjectResult MeterNotFound(int id)
    {
        return Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Meter not found.",
            detail: $"No meter with ID {id} exists.",
            instance: HttpContext.Request.Path.Value);
    }

    private ObjectResult MeterValidationProblem()
    {
        var problemDetails = new ValidationProblemDetails(ModelState)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Meter validation failed.",
            Detail = "Correct the invalid fields and try again.",
            Instance = HttpContext.Request.Path.Value
        };

        return new ObjectResult(problemDetails)
        {
            StatusCode = StatusCodes.Status400BadRequest,
            ContentTypes = { "application/problem+json" }
        };
    }
}
