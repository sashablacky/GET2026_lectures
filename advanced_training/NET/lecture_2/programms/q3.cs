int num1;
int num2;

Console.WriteLine("Enter first number: ");
num1 = int.Parse(Console.ReadLine());

Console.WriteLine("Enter second number: ");
num2 = int.Parse(Console.ReadLine());

Console.WriteLine(Math.Abs(num1 - num2));
Console.WriteLine($"{Math.Max(num1, num2)} is the maximum number and {Math.Min(num1, num2)} is the minimum number");
Console.WriteLine($"The square root of {num1} is {Math.Sqrt(num1)} and the square root of {num2} is {Math.Sqrt(num2)}");
Console.WriteLine($"The power of {num1} raised to {num2} is {Math.Pow(num1, num2)}");

decimal num3;
Console.WriteLine("Enter a decimal number: ");
num3 = decimal.Parse(Console.ReadLine());
Console.WriteLine(Math.Floor(num3));