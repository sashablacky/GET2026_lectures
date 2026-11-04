List<double> readings = new();

Console.Write("How many readings: ");
int n = int.Parse(Console.ReadLine()!);
for (int i = 0; i < n; i++)
{
    Console.Write($"Reading {i + 1}: ");
    readings.Add(double.Parse(Console.ReadLine()!));
}

Console.WriteLine($"\nMin: {MinReading(readings)}");
Console.WriteLine($"Max: {MaxReading(readings)}");
Console.WriteLine($"Average: {AverageReading(readings)}");

Console.WriteLine("\nReadings above 100:");
foreach (var r in readings.Where(r => r > 100))
    Console.WriteLine(r);

Console.WriteLine("\nSorted readings:");
foreach (var r in readings.OrderBy(r => r))
    Console.WriteLine(r);

double MinReading(List<double> list)
{
    double min = list[0];
    foreach (var r in list)
        if (r < min) min = r;
    return min;
}

double MaxReading(List<double> list)
{
    double max = list[0];
    foreach (var r in list)
        if (r > max) max = r;
    return max;
}

double AverageReading(List<double> list)
{
    double sum = 0;
    foreach (var r in list)
        sum += r;
    return sum / list.Count;
}
