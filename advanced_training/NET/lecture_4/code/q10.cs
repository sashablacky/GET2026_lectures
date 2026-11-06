Employee fullTimeEmployee = new FullTimeEmployee("Alex", 1, 5000);
Employee partTimeEmployee = new PartTimeEmployee("Jordan", 2, 20, 25);

Console.WriteLine($"{fullTimeEmployee.Name}, ID: {fullTimeEmployee.EmployeeId}, Salary: {fullTimeEmployee.CalculateSalary()}");
Console.WriteLine($"{partTimeEmployee.Name}, ID: {partTimeEmployee.EmployeeId}, Salary: {partTimeEmployee.CalculateSalary()}");

abstract class Employee(string name, int employeeId)
{
	public string Name { get; set; } = name;
	public int EmployeeId { get; set; } = employeeId;
	public abstract double CalculateSalary();
}

class FullTimeEmployee(string name, int employeeId, double monthlySalary)
	: Employee(name, employeeId)
{
    public double MonthlySalary { get; set; } = monthlySalary;

    public override double CalculateSalary()
    {
        return MonthlySalary;
    }
}

class PartTimeEmployee(string name, int employeeId, int hoursWorked, double hourlyRate)
	: Employee(name, employeeId)
{
    public int HoursWorked { get; set; } = hoursWorked;
    public double HourlyRate { get; set; } = hourlyRate;

    public override double CalculateSalary()
    {
        return HoursWorked * HourlyRate;
    }
}
