using Lecture8Api.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase
{
    private static List<Product> Products = new()
    {
        new Product { Id = 1, Name = "Laptop", Category = "Electronics", Price = 999.99m },
        new Product { Id = 2, Name = "Wireless Mouse", Category = "Electronics", Price = 29.99m },
        new Product { Id = 3, Name = "Notebook", Category = "Stationery", Price = 4.99m }
    };

    [HttpGet]
    public IActionResult GetAllProducts()
    {
        return Ok(Products);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetProduct(int id)
    {
        Product? product = Products.FirstOrDefault(e => e.Id == id);

        if (product == null)
        {
            return BadRequest();
        }

        return Ok(product);
    }

    [HttpGet("category")]
    public IActionResult GetProductsByCategory([FromQuery] string? category)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            return BadRequest("Category is required.");
        }

        List<Product> products = Products.FindAll(
            e => string.Equals(e.Category, category, StringComparison.OrdinalIgnoreCase));

        return Ok(products);
    }

}