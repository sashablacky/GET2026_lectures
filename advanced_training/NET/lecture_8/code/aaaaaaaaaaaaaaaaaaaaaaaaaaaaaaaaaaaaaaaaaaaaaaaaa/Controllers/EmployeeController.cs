using Lecture8Api.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private static List<Employee> employees = new List<Employee>
    {
        new Employee
        {
            Id = 1,
            Name = "Alex Morgan",
            Department = "Engineering",
            Salary = 85000,
            IsActive = true
        },
        new Employee
        {
            Id = 2,
            Name = "Jamie Lee",
            Department = "Human Resources",
            Salary = 72000,
            IsActive = true
        }
    };

    [HttpGet]
    public IActionResult GetAllEmployees()
    {
        return Ok(employees);
    }

    [HttpGet("{id}")]
    public IActionResult GetEmployee(int id)
    {
        Employee? employee = employees.FirstOrDefault(e => e.Id == id);

        if (employee == null)
        {
            return NotFound();
        }

        return Ok(employee);
    }

    [HttpPost]
    public IActionResult AddEmployee(Employee employee)
    {
        bool idAlreadyExists = employees.Any(e => e.Id == employee.Id);

        if (idAlreadyExists)
        {
            return Conflict("An employee with this ID already exists.");
        }

        employees.Add(employee);
        return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateEmployee(int id, Employee updatedEmployee)
    {
        Employee? employee = employees.FirstOrDefault(e => e.Id == id);

        if (employee == null)
        {
            return NotFound();
        }

        employee.Name = updatedEmployee.Name;
        employee.Department = updatedEmployee.Department;
        employee.Salary = updatedEmployee.Salary;
        employee.IsActive = updatedEmployee.IsActive;

        return Ok(employee);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteEmployee(int id)
    {
        Employee? employee = employees.FirstOrDefault(e => e.Id == id);

        if (employee == null)
        {
            return NotFound();
        }

        employees.Remove(employee);
        return NoContent();
    }
}
