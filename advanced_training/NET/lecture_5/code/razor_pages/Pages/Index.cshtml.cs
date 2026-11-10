using Microsoft.AspNetCore.Mvc.RazorPages;

namespace razor_pages.Pages;

// Task 1: Welcome Page
public class IndexModel : PageModel
{
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public void OnGet()
    {
        CompanyName = "Esyasoft";
        Description = "Best Company";
    }
}
