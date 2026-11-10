using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class CommunityLearningPortalModel : PageModel
{
    private readonly HttpClient _api;

    public CommunityLearningPortalModel(IHttpClientFactory httpClientFactory)
    {
        _api = httpClientFactory.CreateClient("Workshops");
    }

    [BindProperty]
    public string ParticipantName { get; set; } = string.Empty;

    [BindProperty]
    public string Email { get; set; } = string.Empty;

    [BindProperty]
    public int WorkshopId { get; set; }

    public List<WorkshopCard> Workshops { get; set; } = new();
    public string SuccessMessage { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;

    public async Task OnGetAsync()
    {
        await LoadWorkshops();
    }

    public async Task OnPostAsync()
    {
        if (!await LoadWorkshops())
        {
            return;
        }

        try
        {
            var response = await _api.PostAsJsonAsync(
                $"/workshops/{WorkshopId}/register",
                new WorkshopRegistrationRequest { ParticipantName = ParticipantName, Email = Email });

            if (response.IsSuccessStatusCode)
            {
                SuccessMessage = "Registration successful.";
                ErrorMessage = string.Empty;
                return;
            }

            ErrorMessage = await response.Content.ReadAsStringAsync();
            SuccessMessage = string.Empty;
        }
        catch (HttpRequestException)
        {
            ErrorMessage = "Could not connect to the workshop API. Start the Minimal API on port 5022.";
            SuccessMessage = string.Empty;
        }
    }

    private async Task<bool> LoadWorkshops()
    {
        try
        {
            Workshops = await _api.GetFromJsonAsync<List<WorkshopCard>>("/workshops") ?? new List<WorkshopCard>();
            return true;
        }
        catch (HttpRequestException)
        {
            ErrorMessage = "Could not connect to the workshop API. Start the Minimal API on port 5022.";
            return false;
        }
    }
}

public class WorkshopCard
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Speaker { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}

public class WorkshopRegistrationRequest
{
    public string ParticipantName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
