var developer = new Developer("Alex", 101, 75000m, "C#");
var manager = new Manager("Jordan", 102, 90000m, 5);

developer.DisplayDeveloperDetails();
manager.DisplayManagerDetails();
class Employee
{
    public string Name{get;set;}
    public int EmployeeId{get;set;}
    public decimal Salary{get;set;}

    public Employee(string name, int empID, decimal salary)
    {
        Name = name;
        EmployeeId = empID;
        Salary = salary;
    }

    public void DisplayEmployeeDetails()
    {
        Console.WriteLine($"Name: {Name}, Employee ID: {EmployeeId}, Salary: {Salary}");
    }
}

class Developer : Employee
{
    public string ProgrammingLanguage {get;set;}

    public Developer(string name, int empID, decimal salary, string programmingLanguage)
        : base(name, empID, salary)
    {
        ProgrammingLanguage = programmingLanguage;
    }

    public void DisplayDeveloperDetails()
    {
        DisplayEmployeeDetails();
        Console.WriteLine($"Programming Language: {ProgrammingLanguage}");
    }
}

class Manager : Employee
{
    public int TeamSize {get;set;}

    public Manager(string name, int empID, decimal salary, int teamSize)
        : base(name, empID, salary)
    {
        TeamSize = teamSize;
    }

    public void DisplayManagerDetails()
    {
        DisplayEmployeeDetails();
        Console.WriteLine($"Team Size: {TeamSize}");
    }
}
