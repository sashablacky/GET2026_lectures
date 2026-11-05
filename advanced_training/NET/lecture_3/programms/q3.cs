Employee employee1 = new Employee(50000, "E001", "Alice");
Employee employee2 = new Employee(60000, "E002", "Bob");

employee1.DisplayDetails();
employee2.DisplayDetails();

class Employee
{
    private double salary;
    public string EmployeeID { get; set; }
    public string Name { get; set; }

    public double Salary
    {
        get { return salary; }
        set { salary = value; }
    }

    public Employee(double salary, string empID, string name)
    {
        this.Salary = salary;
        this.EmployeeID = empID;
        this.Name = name;
    }

    public void DisplayDetails()
    {
        Console.WriteLine($"Salary: {Salary}, EmployeeID: {EmployeeID}, Name: {Name}");
    }
}


