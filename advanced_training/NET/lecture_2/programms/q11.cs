Random random = new();
List<int> numbers = Enumerable.Range(1, 20)
    .Select(_ => random.Next(1, 101))
    .ToList();

Console.WriteLine($"Generated numbers: {string.Join(", ", numbers)}");
Console.WriteLine($"Even numbers: {string.Join(", ", numbers.Where(number => number % 2 == 0))}");
Console.WriteLine($"Odd numbers: {string.Join(", ", numbers.Where(number => number % 2 == 1))}");
Console.WriteLine($"Greater than 50: {string.Join(", ", numbers.Where(number => number > 50))}");
Console.WriteLine($"Between 20 and 80: {string.Join(", ", numbers.Where(number => number >= 20 && number <= 80))}");
Console.WriteLine($"Sorted numbers: {string.Join(", ", numbers.OrderBy(number => number))}");