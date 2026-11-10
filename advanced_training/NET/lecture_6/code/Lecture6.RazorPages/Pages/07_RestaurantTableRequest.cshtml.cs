using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class RestaurantTableRequestModel : PageModel
{
    [BindProperty]
    public string GuestName { get; set; } = string.Empty;

    [BindProperty]
    public DateTime VisitDate { get; set; } = DateTime.Today;

    [BindProperty]
    public TimeSpan VisitTime { get; set; } = TimeSpan.FromHours(19);

    [BindProperty]
    public int GuestCount { get; set; }

    [BindProperty]
    public string SeatingPreference { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;

    public void OnPost()
    {
        if (string.IsNullOrWhiteSpace(GuestName) || string.IsNullOrWhiteSpace(SeatingPreference))
        {
            ErrorMessage = "Guest name and seating preference are required.";
            Message = string.Empty;
            return;
        }

        if (VisitDate.Date < DateTime.Today || GuestCount < 1)
        {
            ErrorMessage = "Visit date cannot be in the past and guest count must be at least one.";
            Message = string.Empty;
            return;
        }

        Message = $"Request received for {GuestName} on {VisitDate:dd MMM yyyy} at {VisitTime:hh\\:mm} for {GuestCount} guests with {SeatingPreference} seating.";
        ErrorMessage = string.Empty;
    }
}
