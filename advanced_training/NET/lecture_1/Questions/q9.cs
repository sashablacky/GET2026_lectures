int n = 5;
int number = 1;

for (int row = 1; row <= n; row++)
{
    for (int column = 1; column <= row; column++)
    {
        if (column > 1)
            Console.Write(" ");

        Console.Write(number++);
    }

    Console.WriteLine();
}

