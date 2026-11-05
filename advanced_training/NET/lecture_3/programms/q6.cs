Product a = new();
Product b = new("b", 15.5);
Product c = new("c", 16.5, 30);

a.DisplayInfo();
b.DisplayInfo();
c.DisplayInfo();

class Product
{
    public string Name { get; set; }
    public double Price { get; set; }
    public int Stock { get; set; }

    public Product()
    {
        Name = "init_name";
        Price = 0.0;
        Stock = 0;
    }
    public Product(string name, double price)
    {
        Name = name;
        Price = price;
        Stock = 10;
    }
    public Product(string name, double price, int stock)
    {
        Name = name;
        Price = price;
        Stock = stock;
    }

    public void DisplayInfo()
    {
        Console.WriteLine($"Name: {Name}, Price: {Price}, Stock: {Stock}");
    }
}