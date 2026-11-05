int n = 5;

for (int row = 1; row <= n; row++)
{
    for (int space = 0; space < n - row; space++)
    {
        Console.Write(" ");
    }

    for (int star = 0; star < 2 * row - 1; star++)
    {
        Console.Write("*");
    }

    Console.WriteLine();
}