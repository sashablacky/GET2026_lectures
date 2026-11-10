using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class PollVotingModel : PageModel
{
    private static readonly List<PollResult> VoteResults = new()
    {
        new() { Option = "ASP.NET Core", VoteCount = 3 },
        new() { Option = "Spring", VoteCount = 2 },
        new() { Option = "Express", VoteCount = 2 },
        new() { Option = "Flask", VoteCount = 1 }
    };

    public List<PollOption> Options { get; set; } = new();
    public List<PollResult> Results { get; set; } = new();
    public string? Message { get; set; }
    public string? ErrorMessage { get; set; }
    public string LeadingOption { get; set; } = string.Empty;

    [BindProperty]
    public string SelectedOption { get; set; } = string.Empty;

    public void OnGet()
    {
        Options = new List<PollOption>
        {
            new() { OptionName = "ASP.NET Core" },
            new() { OptionName = "Spring" },
            new() { OptionName = "Express" },
            new() { OptionName = "Flask" }
        };

        Results = BuildResults();
        LeadingOption = Results.OrderByDescending(item => item.VoteCount).ThenBy(item => item.Option).FirstOrDefault()?.Option ?? string.Empty;
    }

    public void OnPost()
    {
        Options = new List<PollOption>
        {
            new() { OptionName = "ASP.NET Core" },
            new() { OptionName = "Spring" },
            new() { OptionName = "Express" },
            new() { OptionName = "Flask" }
        };

        if (string.IsNullOrWhiteSpace(SelectedOption))
        {
            ErrorMessage = "Please select an option before voting.";
            Results = BuildResults();
            LeadingOption = Results.OrderByDescending(item => item.VoteCount).ThenBy(item => item.Option).FirstOrDefault()?.Option ?? string.Empty;
            return;
        }

        Results = BuildResults();

        var match = Options.FirstOrDefault(item => item.OptionName.Equals(SelectedOption, StringComparison.OrdinalIgnoreCase));
        if (match is null)
        {
            ErrorMessage = "Selected option is not valid.";
            LeadingOption = Results.OrderByDescending(item => item.VoteCount).ThenBy(item => item.Option).FirstOrDefault()?.Option ?? string.Empty;
            return;
        }

        var existing = Results.FirstOrDefault(item => item.Option.Equals(match.OptionName, StringComparison.OrdinalIgnoreCase));
        if (existing is null)
        {
            ErrorMessage = "Selected option was not found in the current results.";
            LeadingOption = Results.OrderByDescending(item => item.VoteCount).ThenBy(item => item.Option).FirstOrDefault()?.Option ?? string.Empty;
            return;
        }

        existing.VoteCount += 1;
        Message = $"Thank you for voting for {match.OptionName}.";
        ErrorMessage = null;

        var totalVotes = Results.Sum(item => item.VoteCount);
        foreach (var result in Results)
        {
            result.Percentage = totalVotes == 0 ? 0 : Math.Round((result.VoteCount * 100d) / totalVotes, 2);
        }

        LeadingOption = Results.OrderByDescending(item => item.VoteCount).ThenBy(item => item.Option).FirstOrDefault()?.Option ?? string.Empty;
    }

    private List<PollResult> BuildResults()
    {
        var totalVotes = VoteResults.Sum(item => item.VoteCount);
        foreach (var result in VoteResults)
        {
            result.Percentage = totalVotes == 0 ? 0 : Math.Round((result.VoteCount * 100d) / totalVotes, 2);
        }

        return VoteResults;
    }
}

public class PollOption
{
    public string OptionName { get; set; } = string.Empty;
}

public class PollResult
{
    public string Option { get; set; } = string.Empty;
    public int VoteCount { get; set; }
    public double Percentage { get; set; }
}
