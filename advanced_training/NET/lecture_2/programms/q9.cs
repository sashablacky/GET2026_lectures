List<double> consumption = new List<double>(7);

for (int i = 0; i < 7; i++) {
    Console.WriteLine($"Enter the consumption for day {i + 1}: ");
    double dailyConsumption = double.Parse(Console.ReadLine());
    consumption.Add(dailyConsumption);
}

Console.WriteLine(consumption.Max());
Console.WriteLine(consumption.Min());
Console.WriteLine(consumption.Average());

Console.WriteLine("Enter a new consumption value to add to the list: ");
consumption.Add(double.Parse(Console.ReadLine()));

consumption.Remove(consumption.Min());