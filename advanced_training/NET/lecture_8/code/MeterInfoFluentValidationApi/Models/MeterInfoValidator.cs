using FluentValidation;

namespace MeterInfoFluentValidationApi.Models;

public class MeterInfoValidator : AbstractValidator<MeterInfo>
{
    public MeterInfoValidator()
    {
        RuleFor(meter => meter.SerialNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Serial number is required.")
            .Matches(@"\AMTR-[0-9]{6}\z")
            .WithMessage("Serial number must follow the format MTR-123456.");

        RuleFor(meter => meter.MeterName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Meter name is required.")
            .MinimumLength(3)
            .WithMessage("Meter name must contain at least 3 characters.");

        RuleFor(meter => meter.Reading)
            .InclusiveBetween(0m, 100000m)
            .WithMessage("Reading must be between 0 and 100000.");

        RuleFor(meter => meter.MeterType)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage("Meter type is required.")
            .Must(meterType => meterType is "Domestic" or "Commercial")
            .WithMessage("Meter type must be exactly 'Domestic' or 'Commercial' (case-sensitive).");

        RuleFor(meter => meter.Reading)
            .GreaterThan(100m)
            .WithMessage("Reading must be greater than 100 for Commercial meters.")
            .When(meter => meter.MeterType == "Commercial");

        RuleFor(meter => meter.InstallationDate)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage("Installation date is required.")
            .Must(installationDate => installationDate.HasValue && installationDate.Value <= DateTime.Now)
            .WithMessage("Installation date cannot be in the future.");

        RuleFor(meter => meter.Email)
            .EmailAddress()
            .WithMessage("Email must have a valid format.")
            .When(meter => !string.IsNullOrWhiteSpace(meter.Email));
    }
}
