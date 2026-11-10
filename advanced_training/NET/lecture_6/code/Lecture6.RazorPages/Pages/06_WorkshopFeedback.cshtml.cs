using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class WorkshopFeedbackModel : PageModel
{
    [BindProperty]
    public string ParticipantName { get; set; } = string.Empty;

    [BindProperty]
    public string WorkshopName { get; set; } = string.Empty;

    [BindProperty]
    public int Rating { get; set; }

    [BindProperty]
    public string Comments { get; set; } = string.Empty;

    public string ErrorMessage { get; set; } = string.Empty;
    public string SuccessMessage { get; set; } = string.Empty;

    public void OnPost()
    {
        if (string.IsNullOrWhiteSpace(ParticipantName) || string.IsNullOrWhiteSpace(WorkshopName))
        {
            ErrorMessage = "Name and workshop are required.";
            SuccessMessage = string.Empty;
            return;
        }

        if (Rating < 1 || Rating > 5)
        {
            ErrorMessage = "Rating must be between 1 and 5.";
            SuccessMessage = string.Empty;
            return;
        }

        ErrorMessage = string.Empty;
        SuccessMessage = Rating >= 4
            ? $"Thank you, {ParticipantName}! Your feedback for {WorkshopName} was excellent. Rating: {Rating}. Comments: {Comments}"
            : $"Thank you, {ParticipantName}! Your feedback for {WorkshopName} has been recorded. Rating: {Rating}. Comments: {Comments}";
    }
}
