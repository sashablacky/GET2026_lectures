int n = 5;

for (int i = 1; i <= n; i++)
{
    Console.Write(new string('*', i));
    Console.Write(new string(' ', 2 * (n - i)));
    Console.WriteLine(new string('*', i));
}

for (int i = n - 1; i >= 1; i--)
{
    Console.Write(new string('*', i));
    Console.Write(new string(' ', 2 * (n - i)));
    Console.WriteLine(new string('*', i));
}

