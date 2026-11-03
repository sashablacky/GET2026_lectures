List<string> watchlist = new List<string>();

watchlist.Add("The Shawshank Redemption");
watchlist.Add("Inception");
watchlist.Add("Spirited Away");

whatchlist.Remove("Inception");

Console.WriteLine("Updated Watchlist:");
foreach (string movie in watchlist)
{
    Console.WriteLine(movie);
}

Console.WriteLine("Total movies in watchlist: " + watchlist.Count);

Console.WriteLine("Enter a movie to check if it's in the watchlist: ");
string movieToCheck = Console.ReadLine();
Console.WriteLine(watchlist.Contains(movieToCheck) ? $"{movieToCheck} is in the watchlist." : $"{movieToCheck} is not in the watchlist.");

Console.Writline("Enter how many movies you want to add to the watchlist: ");
int numberOfMoviesToAdd = int.Parse(Console.ReadLine());

for (int i = 0; i < numberOfMoviesToAdd; i++)
{
    Console.WriteLine($"Enter movie {i + 1}: ");
    string newMovie = Console.ReadLine();
    watchlist.Add(newMovie);
}

