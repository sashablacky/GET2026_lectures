using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class StudyTimetableModel : PageModel
{
    private static readonly List<StudyTask> SampleTasks = new()
    {
        new() { Id = 1, Subject = "Mathematics", Day = "Monday", StartTime = new TimeSpan(9, 0, 0), DurationMinutes = 60, IsCompleted = true },
        new() { Id = 2, Subject = "Algorithms", Day = "Tuesday", StartTime = new TimeSpan(10, 30, 0), DurationMinutes = 90, IsCompleted = false },
        new() { Id = 3, Subject = "English", Day = "Wednesday", StartTime = new TimeSpan(14, 0, 0), DurationMinutes = 45, IsCompleted = true },
        new() { Id = 4, Subject = "Database Design", Day = "Thursday", StartTime = new TimeSpan(11, 0, 0), DurationMinutes = 75, IsCompleted = false },
        new() { Id = 5, Subject = "Revision", Day = "Friday", StartTime = new TimeSpan(8, 30, 0), DurationMinutes = 50, IsCompleted = false }
    };

    public List<StudyTask> Tasks { get; set; } = new();

    [BindProperty]
    public int SelectedTaskId { get; set; }

    public string ErrorMessage { get; set; } = string.Empty;

    public void OnGet()
    {
        Tasks = SampleTasks;
    }

    public void OnPost()
    {
        OnGet();

        var task = Tasks.FirstOrDefault(item => item.Id == SelectedTaskId);
        if (task is null)
        {
            ErrorMessage = "Selected task was not found.";
            return;
        }

        if (task.IsCompleted)
        {
            ErrorMessage = "This task is already completed.";
            return;
        }

        task.IsCompleted = true;
        ErrorMessage = string.Empty;
    }

    public int DayOrder(string day) => day switch
    {
        "Monday" => 1,
        "Tuesday" => 2,
        "Wednesday" => 3,
        "Thursday" => 4,
        "Friday" => 5,
        _ => 99
    };
}

public class StudyTask
{
    public int Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Day { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsCompleted { get; set; }
}
