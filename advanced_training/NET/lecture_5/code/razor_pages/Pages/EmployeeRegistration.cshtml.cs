using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace razor_pages.Pages;

// Task 4: Employee Registration Form
public class EmployeeRegistrationModel : PageModel
{
    [BindProperty]
    public string? Name { get; set; }

    [BindProperty]
    public string? Email { get; set; }

    [BindProperty]
    public string? Phone { get; set; }

    [BindProperty]
    public string? Department { get; set; }

    [BindProperty]
    public decimal Salary { get; set; }

    public string Message { get; set; } = string.Empty;
    public bool IsSuccess { get; set; }

    public void OnGet()
    {
    }

    public void OnPost()
    {
        if (string.IsNullOrWhiteSpace(Name) || string.IsNullOrWhiteSpace(Email))
        {
            Message = "Name and Email are required to register.";
            return;
        }

        IsSuccess = true;
        Message = $"Registration successful for {Name}.";
    }
}
