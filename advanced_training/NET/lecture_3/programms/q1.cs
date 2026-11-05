Car Toyota = new("Yaris", "red", "2019");
Car Nissan = new("180sx", "white", "1998");

Toyota.DisplayDetails();
Nissan.DisplayDetails();

class Car
{
    public string model;
    public string Color { get; set; }
    public string Year { get; set; }
    public string Model
    {
        get { return model; }
        set { model = value; }
    }

    public Car(string model, string color, string year)
    {
        this.Model = model;
        this.Color = color;
        this.Year = year;
    }
    public void DisplayDetails()
    {
        Console.Write($"Model: {Model}, Color: {Color}, Year: {Year}\n");
    }
}