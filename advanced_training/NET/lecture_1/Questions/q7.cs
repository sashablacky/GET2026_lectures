
int n = 5;

for (int row = 0; row < n; row++)
{
    for (int column = 0; column < n; column++)
    {
        if (row == 0 || row == n - 1 || column == 0 || column == n - 1)
            Console.Write('*');
        else
            Console.Write(' ');
    }

    Console.WriteLine();
}

