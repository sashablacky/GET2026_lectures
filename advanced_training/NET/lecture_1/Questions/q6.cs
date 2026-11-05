int n = 5;

for (int row = 1; row <= n; row++)
{
    Console.WriteLine(new string(' ', n - row) + new string('*', 2 * row - 1));
}

for (int row = n - 1; row >= 1; row--)
{
    Console.WriteLine(new string(' ', n - row) + new string('*', 2 * row - 1));
}

