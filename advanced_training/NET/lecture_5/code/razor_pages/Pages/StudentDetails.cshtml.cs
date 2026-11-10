using Microsoft.AspNetCore.Mvc.RazorPages;

namespace razor_pages.Pages;

// Task 2: Student Details Page
public class StudentDetailsModel : PageModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Course { get; set; } = string.Empty;
    public int Age { get; set; }
    public string College { get; set; } = string.Empty;

    public void OnGet()
    {
        Id = 101;
        Name = "John";
        Course = ".NET";
        Age = 25;
        College = "ABC College";
    }
}
