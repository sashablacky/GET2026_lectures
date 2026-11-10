using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace razor_pages.Pages;

// Task 7: Meter Onboarding Website
public class MeterOnboardingModel : PageModel
{
    public static readonly string[] ConnectionTypes = ["Residential", "Commercial"];

    [BindProperty]
    public string? CustomerName { get; set; }

    [BindProperty]
    public string? MeterNumber { get; set; }

    [BindProperty]
    public string? Location { get; set; }

    [BindProperty]
    public string? ConnectionType { get; set; }

    public List<string> Errors { get; set; } = [];
    public string SuccessMessage { get; set; } = string.Empty;

    public void OnGet()
    {
    }

    public void OnPost()
    {
        if (string.IsNullOrWhiteSpace(CustomerName)) Errors.Add("Customer Name is required.");
        if (string.IsNullOrWhiteSpace(MeterNumber)) Errors.Add("Meter Number is required.");
        if (string.IsNullOrWhiteSpace(Location)) Errors.Add("Location is required.");
        if (string.IsNullOrWhiteSpace(ConnectionType))
        {
            Errors.Add("Connection Type is required.");
        }
        else if (!ConnectionTypes.Contains(ConnectionType))
        {
            // Guards against tampered form values
            Errors.Add("Connection Type must be Residential or Commercial.");
        }

        if (Errors.Count == 0)
        {
            SuccessMessage = $"Customer {CustomerName} has been onboarded successfully.";
        }
    }
}
