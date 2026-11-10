using Microsoft.AspNetCore.Mvc.RazorPages;
using razor_pages.Models;

namespace razor_pages.Pages;

// Task 5: Product Details Page
public class ProductsModel : PageModel
{
    public List<Product> ProductList { get; set; } = [];

    public void OnGet()
    {
        ProductList =
        [
            new Product { Id = 1, Name = "Laptop", Category = "Computers", Price = 999.99m, StockQuantity = 12 },
            new Product { Id = 2, Name = "Keyboard", Category = "Accessories", Price = 49.99m, StockQuantity = 30 },
            new Product { Id = 3, Name = "Mouse", Category = "Accessories", Price = 24.99m, StockQuantity = 0 },
            new Product { Id = 4, Name = "Monitor", Category = "Displays", Price = 249.99m, StockQuantity = 18 },
            new Product { Id = 5, Name = "Headphones", Category = "Audio", Price = 79.99m, StockQuantity = 20 }
        ];
    }
}
