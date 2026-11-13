using Lecture8Api.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase
{
    private static List<Product> Products = new();

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
            return NotFound();
        }

        return Ok(product);
    }
}