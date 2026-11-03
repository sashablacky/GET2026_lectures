int[] times = new int[10];

for (int i = 0; i < times.Length; i++)
{
    Console.WriteLine("Enter time in seconds:");
    times[i] = int.Parse(Console.ReadLine());
}

Console.WriteLine("Times: " + string.Join(", ", times));
Console.WriteLine($"Max: {times.Max()}");
Console.WriteLine($"Min: {times.Min()}");
Console.WriteLine($"Average: {times.Average()}");