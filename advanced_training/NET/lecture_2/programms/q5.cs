Console.WriteLine(DateTime.Now);
Console.WriteLine(DateOnly.FromDateTime(DateTime.Now));
Console.WriteLine(DateOnly.FromDateTime(DateTime.Now).AddDays(7));
Console.WriteLine(DateOnly.FromDateTime(DateTime.Now).AddDays(30));
Console.WriteLine(DateOnly.FromDateTime(DateTime.Now).AddMonths(1));
Console.WriteLine(DateOnly.FromDateTime(DateTime.Now).AddYears(1));