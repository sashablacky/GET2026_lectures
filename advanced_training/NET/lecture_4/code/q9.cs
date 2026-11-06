ElectricMeter electricMeter = new ElectricMeter(1001, 120, 230);
GasMeter gasMeter = new GasMeter(2001, 75, 2.5);

electricMeter.ActivateMeter();
electricMeter.DisplayMeterDetails();
electricMeter.UpdateReading(135);
electricMeter.CalculateBill();
electricMeter.DeactivateMeter();

gasMeter.ActivateMeter();
gasMeter.DisplayMeterDetails();
gasMeter.UpdateReading(82);
gasMeter.CalculateBill();
gasMeter.DeactivateMeter();

interface IMeterOperations
{
    void ActivateMeter();
    void DeactivateMeter();
}

class Meter
{
    public int SerialNumber { get; set; }
    public double Reading { get; set; }

    public Meter(int serialNumber, double reading)
    {
        SerialNumber = serialNumber;
        Reading = reading;
    }

    public virtual void DisplayMeterDetails()
    {
        Console.WriteLine($"Serial number: {SerialNumber}, Reading: {Reading}");
    }

    public void UpdateReading(double reading)
    {
        Reading = reading;
    }

    public virtual void CalculateBill()
    {
        Console.WriteLine("Bill calculation is not defined for this meter.");
    }
}

class ElectricMeter : Meter, IMeterOperations
{
    private const double RatePerUnit = 0.15;

    public double Voltage { get; set; }

    public ElectricMeter(int serialNumber, double reading, double voltage)
        : base(serialNumber, reading)
    {
        Voltage = voltage;
    }

    public override void DisplayMeterDetails()
    {
        base.DisplayMeterDetails();
        Console.WriteLine($"Type: Electric, Voltage: {Voltage} V");
    }

    public override void CalculateBill()
    {
        Console.WriteLine($"Electricity bill: {Reading * RatePerUnit:C}");
    }

    public void ActivateMeter() => Console.WriteLine($"Electric meter {SerialNumber} activated.");

    public void DeactivateMeter() => Console.WriteLine($"Electric meter {SerialNumber} deactivated.");
}

class GasMeter : Meter, IMeterOperations
{
    private const double RatePerUnit = 0.08;

    public double Pressure { get; set; }

    public GasMeter(int serialNumber, double reading, double pressure)
        : base(serialNumber, reading)
    {
        Pressure = pressure;
    }

    public override void DisplayMeterDetails()
    {
        base.DisplayMeterDetails();
        Console.WriteLine($"Type: Gas, Pressure: {Pressure}");
    }

    public override void CalculateBill()
    {
        Console.WriteLine($"Gas bill: {Reading * RatePerUnit:C}");
    }

    public void ActivateMeter() => Console.WriteLine($"Gas meter {SerialNumber} activated.");

    public void DeactivateMeter() => Console.WriteLine($"Gas meter {SerialNumber} deactivated.");
}
