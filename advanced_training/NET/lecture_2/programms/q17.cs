List<int> scores = new();

Console.Write("How many participants: ");
int n = int.Parse(Console.ReadLine()!);
for (int i = 0; i < n; i++)
{
    Console.Write($"Score {i + 1}: ");
    scores.Add(int.Parse(Console.ReadLine()!));
}

Console.WriteLine("\nAll scores:");
foreach (var s in scores)
    Console.WriteLine(s);

Console.WriteLine($"\nHighest: {scores.Max()}");
Console.WriteLine($"Lowest: {scores.Min()}");

double avg = Average(scores);
Console.WriteLine($"Average: {avg}");

Console.WriteLine("\nScores above average:");
foreach (var s in scores.Where(s => s > avg))
    Console.WriteLine(s);

Console.WriteLine("\nSorted scores:");
foreach (var s in scores.OrderBy(s => s))
    Console.WriteLine(s);

var doubled = scores.Select(s => s * 2).ToList();
Console.WriteLine("\nScores x2:");
foreach (var s in doubled)
    Console.WriteLine(s);

double Average(List<int> list)
{
    int sum = 0;
    foreach (var s in list)
        sum += s;
    return (double)sum / list.Count;
}
