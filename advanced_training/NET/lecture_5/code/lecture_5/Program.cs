var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<Student> StudentList =
[
    new() { Id = 1, Name = "Alice", Age = 20, Course = "Mathematics" },
    new() { Id = 2, Name = "Bob", Age = 21, Course = "Physics" },
    new() { Id = 3, Name = "Charlie", Age = 19, Course = "Computer Science" }
];

List<Product> ProductList =
[
    //Id, Name, Category, Price and Stock
    new() { Id = 1, Name = "Laptop", Category = "Electronics", Price = 1200m, Stock = 5 },
    new() { Id = 2, Name = "Headphones", Category = "Electronics", Price = 150m, Stock = 20 },
    new() { Id = 3, Name = "Smartphone", Category = "Electronics", Price = 900m, Stock = 8 },
    new() { Id = 4, Name = "Clean Code", Category = "Books", Price = 35m, Stock = 12 },
    new() { Id = 5, Name = "The Pragmatic Programmer", Category = "Books", Price = 40m, Stock = 7 },
    new() { Id = 6, Name = "T-Shirt", Category = "Clothing", Price = 20m, Stock = 50 },
    new() { Id = 7, Name = "Jeans", Category = "Clothing", Price = 60m, Stock = 0 },
    new() { Id = 8, Name = "Coffee Beans", Category = "Food", Price = 15m, Stock = 30 },
    new() { Id = 9, Name = "Desk Lamp", Category = "Home", Price = 45m, Stock = 10 }
];

List<Employee> EmployeeList =
[
    new() { Id = 1, Name = "Alice Johnson", Email = "alice@example.com", Department = "IT", BasicSalary = 60000m, Bonus = 5000m },
    new() { Id = 2, Name = "Bob Smith", Email = "bob@example.com", Department = "HR", BasicSalary = 52000m, Bonus = 3000m },
    new() { Id = 3, Name = "Carol Davis", Email = "carol@example.com", Department = "IT", BasicSalary = 65000m, Bonus = 7000m }
];

List<Book> BookList =
[
    new() { Id = 1, Title = "Clean Code", Author = "Robert C. Martin", Price = 35m, IsAvailable = true },
    new() { Id = 2, Title = "The Pragmatic Programmer", Author = "Andrew Hunt", Price = 40m, IsAvailable = false },
    new() { Id = 3, Title = "Refactoring", Author = "Martin Fowler", Price = 45m, IsAvailable = true }
];

app.MapGet("/", () => "Welcome to WelcomeApi!");
app.MapGet("/about", () => new
{
    application = "WelcomeApi",
    purpose = "A simple API that provides a welcome message."
});
app.MapGet("/students", () => StudentList);
app.MapGet("/students/{id}", (int id) =>
{
    var student = StudentList.FirstOrDefault(student => student.Id == id);
    return student is null ? Results.NotFound() : Results.Ok(student);
});


app.MapGet("/products", () => ProductList);
app.MapGet("/products/stock", () => ProductList.Where(product => product.Stock > 0).ToList());
app.MapGet("/products/{id:int}", (int id) =>
{
    var product = ProductList.FirstOrDefault(product => product.Id == id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});
app.MapGet("/products/category/{category}", (string category) =>
{
    var products = ProductList.Where(product => product.Category == category).ToList();
    return products.Count == 0 ? Results.NotFound() : Results.Ok(products);
});
app.MapPost("/products", (Product product) =>
{
    if (string.IsNullOrWhiteSpace(product.Name) || string.IsNullOrWhiteSpace(product.Category))
    {
        return Results.BadRequest("Name and Category are required.");
    }
    if (product.Price < 0 || product.Stock < 0)
    {
        return Results.BadRequest("Price and Stock cannot be negative.");
    }

    product.Id = ProductList.Count == 0 ? 1 : ProductList.Max(p => p.Id) + 1;
    ProductList.Add(product);
    return Results.Created($"/products/{product.Id}", product);
});


app.MapGet("/employees", (int? id) =>
{
    if (id is null)
    {
        return Results.Ok(EmployeeList);
    }

    var employee = EmployeeList.FirstOrDefault(employee => employee.Id == id.Value);
    return employee is null ? Results.NotFound() : Results.Ok(employee);
});
app.MapPost("/employees", (Employee employee) =>
{
    if (string.IsNullOrWhiteSpace(employee.Name) || string.IsNullOrWhiteSpace(employee.Email))
    {
        return Results.BadRequest("Name and Email are required.");
    }
    employee.Id = EmployeeList.Count == 0 ? 1 : EmployeeList.Max(e => e.Id) + 1;

    EmployeeList.Add(employee);
    return Results.Ok(employee);
});

IResult GetEmployeeSalary(int id)
{
    var employee = EmployeeList.FirstOrDefault(employee => employee.Id == id);
    if (employee is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(new
    {
        name = employee.Name,
        basicSalary = employee.BasicSalary,
        bonus = employee.Bonus,
        totalSalary = employee.BasicSalary + employee.Bonus
    });
}

app.MapGet("/employees/{id:int}/salary", (int id) => GetEmployeeSalary(id));

app.MapGet("/employees/department/{department}", (string department) =>
{
    var employees = EmployeeList
        .Where(employee => string.Equals(employee.Department, department, StringComparison.OrdinalIgnoreCase))
        .ToList();
    return employees.Count == 0 ? Results.NotFound() : Results.Ok(employees);
});


app.MapPost("/books", (Book book) =>
{
   book.Id = BookList.Count == 0 ? 1 : BookList.Max(e => e.Id) + 1;

   BookList.Add(book);
   return Results.Ok(book);
});
app.MapGet("/books", () => BookList);
app.MapGet("/books/available", () => BookList.Where(book => book.IsAvailable).ToList());
app.MapGet("/books/{id:int}", (int id) =>
{
    var book = BookList.FirstOrDefault(book => book.Id == id);
    return book is null ? Results.NotFound() : Results.Ok(book);
});

app.Run();

class Student
{
    public int Id{get;set;} = 0;
    public string Name{get;set;} = "";
    public int Age{get;set;} = 0;
    public string Course{get;set;} = "";
}

class Product
{
    public int Id{get;set;} = 0;
    public string Name{get;set;} = "";
    public string Category{get;set;} = "";
    public decimal Price{get;set;} = 0m;
    public int Stock{get;set;} = 0;
}

class Employee
{
    //Id, Name, Email, Department and Salary
    public int Id{get;set;}
    public string Name{get;set;} = "";
    public string Email{get;set;} = "";
    public string Department{get;set;} = "";
    public decimal BasicSalary{get;set;}
    public decimal Bonus{get;set;}
}

class Book
{
    //Id, Title, Author, Price and IsAvailable
    public int Id{get;set;}
    public string Title{get;set;} = "";
    public string Author{get;set;} = "";
    public decimal Price{get;set;}
    public bool IsAvailable{get;set;}
} 
