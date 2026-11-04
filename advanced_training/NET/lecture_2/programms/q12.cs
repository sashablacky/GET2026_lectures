Random random = new();
List<double> prices = [.. Enumerable.Range(0, 10)
    .Select(_ => (double)random.Next(1, 1000))];


Console.WriteLine($"Price more than 500: {string.Join(" ", prices.Where(number => number > 500))}");
Console.WriteLine($"Price less than 100: {string.Join(" ", prices.Where(number => number < 100))}");
Console.WriteLine($"Prices sorted: {string.Join(" ", prices.OrderBy(number => number))}");

List<double> discountedPrices = [.. prices.Select(price => price * 0.9)];
Console.WriteLine($"Discounted prices: {string.Join(" ", discountedPrices)}");
