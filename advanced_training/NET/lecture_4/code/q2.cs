Car car = new Car(4, "Toyota", "Corolla", "2026");
car.DisplayCarDetails();
car.Start();
car.Stop();

Bike bike = new Bike(150, "Honda", "CB150R", "2026");
bike.DisplayBikeDetails();
bike.Start();
bike.Stop();
class Vehicle
{
    public string Brand{get;set;}
    public string Model{get;set;}
    public string Year{get;set;}

    public Vehicle(string brand, string model, string year)
    {
        Brand = brand;
        Model = model;
        Year = year;
    }

    public void Start()
    {
        Console.WriteLine($"{Brand} {Model} is starting.");
    }

    public void Stop()
    {
        Console.WriteLine($"{Brand} {Model} is stopping.");
    }
}

class Car : Vehicle
{
    public int NumberOfDoors {get;set;}
    public Car(int numberofdoors, string brand, string model, string year)
    :base(brand, model, year)
    {
        NumberOfDoors = numberofdoors;
    }

    public void DisplayCarDetails()
    {
        Console.WriteLine($"Car: {Year} {Brand} {Model}, {NumberOfDoors} doors");
    }
}

class Bike : Vehicle
{
    public double EngineCapacity {get;set;}

    public Bike(double enginecapacity, string brand, string model, string year) 
    :base(brand, model, year)
    {
        EngineCapacity = enginecapacity;
    }

    public void DisplayBikeDetails()
    {
        Console.WriteLine($"Bike: {Year} {Brand} {Model}, {EngineCapacity} cc");
    }
}

