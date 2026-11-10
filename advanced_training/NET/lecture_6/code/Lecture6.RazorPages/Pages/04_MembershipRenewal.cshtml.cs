using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class MembershipRenewalModel : PageModel
{
    [BindProperty]
    public string MemberId { get; set; } = string.Empty;

    [BindProperty]
    public string MemberName { get; set; } = string.Empty;

    [BindProperty]
    public string CurrentPlan { get; set; } = string.Empty;

    [BindProperty]
    public int RenewalMonths { get; set; }

    public string? ErrorMessage { get; set; }
    public string? SuccessMessage { get; set; }

    public void OnPost()
    {
        if (string.IsNullOrWhiteSpace(MemberName) || string.IsNullOrWhiteSpace(CurrentPlan) || string.IsNullOrWhiteSpace(MemberId))
        {
            ErrorMessage = "Member ID, name and selected plan are required.";
            SuccessMessage = null;
            return;
        }

        if (RenewalMonths < 1 || RenewalMonths > 12)
        {
            ErrorMessage = "RenewalMonths must be between 1 and 12.";
            SuccessMessage = null;
            return;
        }

        var endDate = DateTime.Today.AddMonths(RenewalMonths);
        SuccessMessage = $"{MemberName} on {CurrentPlan} plan for {RenewalMonths} month(s), valid until {endDate:dd MMM yyyy}.";
        ErrorMessage = null;
    }
}
