using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class ConferenceSessionPlannerModel : PageModel
{
    public List<Session> Sessions { get; set; } = new();
    public List<Session> FilteredSessions { get; set; } = new();
    public List<string> AllTracks { get; set; } = new();

    [BindProperty]
    public string SelectedTrack { get; set; } = string.Empty;

    public void OnGet()
    {
        Sessions = new List<Session>
        {
            new() { Id = 1, Title = "Intro to ASP.NET Core", Speaker = "Rina", Track = "Web", StartTime = new TimeSpan(9, 0, 0) },
            new() { Id = 2, Title = "SQL Essentials", Speaker = "Nia", Track = "Data", StartTime = new TimeSpan(10, 30, 0) },
            new() { Id = 3, Title = "Testing Practices", Speaker = "Omar", Track = "Web", StartTime = new TimeSpan(13, 0, 0) },
            new() { Id = 4, Title = "JavaScript Patterns", Speaker = "Lena", Track = "Frontend", StartTime = new TimeSpan(14, 30, 0) }
        };

        AllTracks = Sessions.Select(session => session.Track).Distinct().OrderBy(track => track).ToList();
        FilteredSessions = Sessions;
    }

    public void OnPost()
    {
        OnGet();

        if (string.IsNullOrWhiteSpace(SelectedTrack))
        {
            FilteredSessions = Sessions;
            return;
        }

        FilteredSessions = Sessions
            .Where(session => session.Track.Equals(SelectedTrack, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}

public class Session
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Speaker { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
}
