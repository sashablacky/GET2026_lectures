using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class TripPlannerModel : PageModel
{
    public List<TripStop> Stops { get; set; } = new();

    public void OnGet()
    {
        Stops = new List<TripStop>
        {
            new() { DayNumber = 1, PlaceName = "Marrakech", ArrivalTime = "09:00", Activity = "Breakfast walk" },
            new() { DayNumber = 1, PlaceName = "Kasbah", ArrivalTime = "11:30", Activity = "Historical tour" },
            new() { DayNumber = 1, PlaceName = "Riad", ArrivalTime = "18:00", Activity = "Dinner and rest" },
            new() { DayNumber = 2, PlaceName = "Atlas Viewpoint", ArrivalTime = "08:30", Activity = "Scenic hike" },
            new() { DayNumber = 2, PlaceName = "Souk", ArrivalTime = "13:00", Activity = "Shopping break" },
            new() { DayNumber = 2, PlaceName = "Airport", ArrivalTime = "17:00", Activity = "Departure" }
        };
    }
}

public class TripStop
{
    public int DayNumber { get; set; }
    public string PlaceName { get; set; } = string.Empty;
    public string ArrivalTime { get; set; } = string.Empty;
    public string Activity { get; set; } = string.Empty;
}
