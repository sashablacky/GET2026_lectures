AreaCalculator.CalculateArea(10, 5);
AreaCalculator.CalculateArea(4);
AreaCalculator.CalculateArea(2.5);


class AreaCalculator
{
    public static void CalculateArea(int length, int breadth)
    {
        System.Console.WriteLine(length * breadth);
    }
    public static void CalculateArea(int side)
    {
        System.Console.WriteLine(side * side);
    }
    public static void CalculateArea(double radius)
    {
        System.Console.WriteLine(System.Math.PI * radius * radius);
    }
}