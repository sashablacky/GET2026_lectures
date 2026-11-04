Dictionary<string, int> inventory = new();

inventory.Add("Apples", 10);
inventory.Add("Oranges", 3);
inventory.Add("Bananas", 0);
inventory.Add("Milk", 7);
inventory.Add("Bread", 0);

inventory["Apples"] = 4;

inventory.Remove("Milk");

string search = "Oranges";
if (inventory.ContainsKey(search))
    Console.WriteLine($"{search} found: {inventory[search]}");
else
    Console.WriteLine($"{search} not found");

Console.WriteLine("\nAll items:");
foreach (var item in inventory)
    Console.WriteLine($"{item.Key}: {item.Value}");

Console.WriteLine("\nOut of stock:");
foreach (var item in inventory.Where(item => item.Value == 0))
    Console.WriteLine(item.Key);

Console.WriteLine("\nQuantity below 5:");
foreach (var item in inventory.Where(item => item.Value < 5))
    Console.WriteLine($"{item.Key}: {item.Value}");

string check = "Milk";
Console.WriteLine($"\nIs {check} available: {inventory.ContainsKey(check) && inventory[check] > 0}");
