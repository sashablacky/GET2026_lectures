using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class ContactDirectoryModel : PageModel
{
    public List<Contact> Contacts { get; set; } = new();
    public List<Contact> FilteredContacts { get; set; } = new();

    [BindProperty]
    public string SearchKeyword { get; set; } = string.Empty;

    public void OnGet()
    {
        Contacts = new List<Contact>
        {
            new() { Name = "Aisha Rahman", Department = "Engineering", Email = "aisha@example.com", Extension = "2201" },
            new() { Name = "Marcus Lee", Department = "Marketing", Email = "marcus@example.com", Extension = "2207" },
            new() { Name = "Prakash Iyer", Department = "Operations", Email = "prakash@example.com", Extension = "2215" },
            new() { Name = "Yasmin Ali", Department = "Finance", Email = "yasmin@example.com", Extension = "2219" },
            new() { Name = "John Park", Department = "Engineering", Email = "john@example.com", Extension = "2234" },
            new() { Name = "Nina Shah", Department = "HR", Email = "nina@example.com", Extension = "2242" },
            new() { Name = "Steven Cole", Department = "Sales", Email = "steven@example.com", Extension = "2250" },
            new() { Name = "Lina Gomez", Department = "Support", Email = "lina@example.com", Extension = "2258" }
        };

        FilteredContacts = Contacts;
    }

    public void OnPost()
    {
        OnGet();

        if (string.IsNullOrWhiteSpace(SearchKeyword))
        {
            FilteredContacts = Contacts;
            return;
        }

        FilteredContacts = Contacts
            .Where(contact => contact.Name.Contains(SearchKeyword, StringComparison.OrdinalIgnoreCase) ||
                contact.Department.Contains(SearchKeyword, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}

public class Contact
{
    public string Name { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Extension { get; set; } = string.Empty;
}
