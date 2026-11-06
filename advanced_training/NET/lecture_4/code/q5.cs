Rectangle rectangle = new Rectangle { Length = 5, Breadth = 3 };
Circle circle = new Circle { Radius = 2 };

rectangle.CalculateArea();
circle.CalculateArea();

class Shape
{
    public virtual void CalculateArea() { }
}

class Rectangle : Shape
{
    public double Length{get;set;}
    public double Breadth{get;set;}

    public override void CalculateArea()
    {
        Console.WriteLine($"Rectangle area: {Length * Breadth}");
    }
}

class Circle : Shape
{
    public double Radius{get;set;}
    
    public override void CalculateArea()
    {
        Console.WriteLine($"Circle area: {Math.PI * Radius * Radius}");
    }

}