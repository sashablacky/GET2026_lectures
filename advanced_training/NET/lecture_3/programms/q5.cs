Random random = new Random();
double celsius = random.NextDouble() * 200 - 100;
double fahrenheit = random.NextDouble() * 300 - 50;

TempConverter.CelsiusToFahrenheit(celsius);
TempConverter.FahrenheitToCelsius(fahrenheit);
class TempConverter
{
    public static void CelsiusToFahrenheit(double celsius)
    {
        Console.WriteLine($"{celsius:F2}°C = {celsius * 9 / 5 + 32:F2}°F");
    }

    public static void FahrenheitToCelsius(double fahrenheit)
    {
        Console.WriteLine($"{fahrenheit:F2}°F = {(fahrenheit - 32) * 5 / 9:F2}°C");
    }
}


