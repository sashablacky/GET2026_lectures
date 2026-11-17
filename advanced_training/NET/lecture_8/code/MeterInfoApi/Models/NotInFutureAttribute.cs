using System.ComponentModel.DataAnnotations;

namespace MeterInfoApi.Models;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class NotInFutureAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        return value is DateTime date && date <= DateTime.Now;
    }
}
