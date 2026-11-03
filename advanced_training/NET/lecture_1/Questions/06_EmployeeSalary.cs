Console.Write("Enter employee name: ");
string employeeName = Console.ReadLine();

Console.Write("Enter designation (Developer, Tester, Manager, Intern): ");
string designation = Console.ReadLine();

int basicSalary;

switch (designation) {
    case "Developer":
        basicSalary = 30000;
        break;
    case "Tester":
        basicSalary = 25000;
        break;
    case "Manager":
        basicSalary = 45000;
        break;
    case "Intern":
        basicSalary = 12000;
        break;
    default:
        Console.WriteLine("Invalid designation.");
        return;
}

double finalSalary = basicSalary + basicSalary * 0.10;

Console.WriteLine("Employee Name: " + employeeName);
Console.WriteLine("Basic Salary: " + basicSalary);
Console.WriteLine("Final Salary with 10% bonus: " + finalSalary);
