List<double> expenses = new();

expenses.Add(250);
expenses.Add(800);
expenses.Add(120);
expenses.Add(1500);
expenses.Add(450);

expenses.Remove(120);

Console.WriteLine("All expenses:");
foreach (var e in expenses)
    Console.WriteLine(e);

Console.WriteLine($"\nNumber of expenses: {expenses.Count}");
Console.WriteLine($"Total: {Total(expenses)}");
Console.WriteLine($"Highest: {expenses.Max()}");
Console.WriteLine($"Lowest: {expenses.Min()}");
Console.WriteLine($"Average: {expenses.Average()}");

Console.WriteLine("\nExpenses above 500:");
foreach (var e in expenses.Where(e => e > 500))
    Console.WriteLine(e);

expenses.Sort();
Console.WriteLine("\nSorted expenses:");
foreach (var e in expenses)
    Console.WriteLine(e);

double Total(List<double> list)
{
    double sum = 0;
    foreach (var e in list)
        sum += e;
    return sum;
}
