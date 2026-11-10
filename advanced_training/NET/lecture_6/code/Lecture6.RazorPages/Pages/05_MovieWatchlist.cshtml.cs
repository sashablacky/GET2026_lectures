using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Lecture6.RazorPages.Pages;

public class MovieWatchlistModel : PageModel
{
    public List<Movie> Movies { get; set; } = new();
    public List<Movie> FilteredMovies { get; set; } = new();
    public List<string> Genres { get; set; } = new();

    [BindProperty]
    public string SelectedGenre { get; set; } = "All";

    public void OnGet()
    {
        Movies = new List<Movie>
        {
            new() { Title = "Arrival", Genre = "Sci-Fi", ReleaseYear = 2016, Watched = true },
            new() { Title = "The Grand Budapest Hotel", Genre = "Comedy", ReleaseYear = 2014, Watched = false },
            new() { Title = "Inception", Genre = "Sci-Fi", ReleaseYear = 2010, Watched = true },
            new() { Title = "The Social Network", Genre = "Drama", ReleaseYear = 2010, Watched = false },
            new() { Title = "La La Land", Genre = "Musical", ReleaseYear = 2016, Watched = true },
            new() { Title = "Parasite", Genre = "Thriller", ReleaseYear = 2019, Watched = true }
        };

        Genres = Movies.Select(movie => movie.Genre).Distinct().OrderBy(genre => genre).ToList();
        FilteredMovies = Movies;
    }

    public void OnPost()
    {
        OnGet();

        if (SelectedGenre == "All")
        {
            return;
        }

        FilteredMovies = Movies.Where(movie => movie.Genre.Equals(SelectedGenre, StringComparison.OrdinalIgnoreCase)).ToList();
    }
}

public class Movie
{
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public bool Watched { get; set; }
}
