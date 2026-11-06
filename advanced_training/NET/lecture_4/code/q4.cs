ElectronicProduct first = new("Acme", 2, 1, "Laptop", 1200m);
ElectronicProduct second = new("SoundCo", 1, 2, "Headphones", 150m);

first.DisplayDetails();
Console.WriteLine($"Price after 10% discount: {first.CalculateDiscount(10):C}");
second.DisplayDetails();
Console.WriteLine($"Price after 10% discount: {second.CalculateDiscount(10):C}");

class Product
{
    public int ProductId{get;set;}
    public string ProductName{get;set;}
    public decimal Price {get;set;}

    public Product(int productId, string productName, decimal price)
    {
        ProductId = productId;
        ProductName = productName;
        Price = price;
    }
}

class ElectronicProduct : Product
{
    public string Brand{get;set;}
    public int WarrantyInYears {get;set;}
    
    public ElectronicProduct(string brand, int warrantyears, int productId, string productName, decimal price) 
    : base( productId,  productName,  price)
    {
        Brand = brand;
        WarrantyInYears = warrantyears;
    }

    public decimal CalculateDiscount(double percentage)
    {
        return Price * (1m - (decimal)percentage / 100m);
    }

    public void DisplayDetails()
    {
        Console.WriteLine($"Product ID: {ProductId}, Name: {ProductName}, Price: {Price:C}, Brand: {Brand}, Warranty: {WarrantyInYears} years");
    }
}
