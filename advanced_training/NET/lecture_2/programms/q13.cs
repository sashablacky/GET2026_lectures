List<string> names = [];

for (int i = 0; i < 10; i++)
{
    Console.Write($"Enter name {i + 1}: ");
    names.Add(Console.ReadLine());
}

Console.WriteLine($"Names in aplphabetical order: {string.Join(" ", names.OrderBy(name => name))}");
Console.WriteLine($"Names containing 'a': {string.Join(" ", names.Where(name => name.Contains('a')))}");

Console.WriteLine("Enter a word or a character you want to find in a name");
string inpstr = Console.ReadLine();
Console.WriteLine($"Names containing specific word or char: {string.Join(" ", names.Where(name => name.Contains(inpstr)))}");

List<string> namesUpper = [.. names.Select(name => name.ToUpper())];
Console.WriteLine($"all names upper case: {string.Join(" ", namesUpper)}");