using Lecture8Api.Models;
using Microsoft.AspNetCore.Mvc;

public class UpdateBookAvailabilityDto
{
    public bool IsAvailable { get; set; }
}

[ApiController]
[Route("api/[controller]")]

public class BookController : ControllerBase
{
    private static readonly List<Book> Books = new()
    {
        new Book { Id = 1, Title = "The Hobbit", Author = "J.R.R. Tolkien", Price = 14.99m, IsAvailable = true },
        new Book { Id = 2, Title = "Clean Code", Author = "Robert C. Martin", Price = 39.99m, IsAvailable = true },
        new Book { Id = 3, Title = "Dune", Author = "Frank Herbert", Price = 19.99m, IsAvailable = false }
    };
    private static int _nextBookId = 4;

    [HttpGet]
    public IActionResult GetAllBooks()
    {
        return Ok(Books);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetProduct(int id)
    {
        Book? book = Books.FirstOrDefault(e => e.Id == id);

        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        book.Id = _nextBookId++;
        Books.Add(book);
        return CreatedAtAction(nameof(GetProduct), new { id = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    public IActionResult UpdateBook(int id, [FromBody] UpdateBookAvailabilityDto update)
    {
        Book? book = Books.Find(e => e.Id == id);

        if (book == null)
        {
            return NotFound();
        }

        book.IsAvailable = update.IsAvailable;

        return Ok(Books);
    }

    [HttpDelete("{id:int}")]
    public IActionResult DeleteBook(int id)
    {
        Book? book = Books.Find(e => e.Id == id);
        if (book == null)
        {
            return NotFound();
        }

        Books.Remove(book);
        return NoContent();
    }
}