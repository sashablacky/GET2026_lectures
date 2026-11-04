Dictionary<string, int> inventory = new();

inventory.Add("Apples", 10);
inventory.Add("Oranges", 5);
inventory.Add("Bananas", 60);

inventory["Apples"] = 15;

Console.WriteLine("All inventory items:");
foreach (var item in inventory)
    Console.WriteLine($"{item.Key}: {item.Value}");

Console.WriteLine("\nItems with quantities below 10:");
foreach (var item in inventory.Where(item => item.Value < 10))
    Console.WriteLine($"{item.Key}: {item.Value}");

Console.WriteLine("\nItems with quantities above 50:");
foreach (var item in inventory.Where(item => item.Value > 50))
    Console.WriteLine($"{item.Key}: {item.Value}");

Console.WriteLine("\nItems sorted by quantity:");
foreach (var item in inventory.OrderBy(item => item.Value))
    Console.WriteLine($"{item.Key}: {item.Value}");

