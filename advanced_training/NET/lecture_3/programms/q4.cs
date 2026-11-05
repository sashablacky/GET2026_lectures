
Calculator.Add(2, 5);
Calculator.Subtract(2, 5);
Calculator.Multiply(2, 5);
Calculator.Divide(2, 5);

class Calculator
{
    public static void Add(double a, double b)
    {
        Console.WriteLine($"{a} + {b} = {a + b}");
    }
    public static void Subtract(double a, double b)
    {
        Console.WriteLine($"{a} - {b} = {a - b}");
    }
    public static void Multiply(double a, double b)
    {
        Console.WriteLine($"{a} * {b} = {a * b}");
    }
    public static void Divide(double a, double b)
    {
        Console.WriteLine($"{a} / {b} = {a / b}");
    }
}