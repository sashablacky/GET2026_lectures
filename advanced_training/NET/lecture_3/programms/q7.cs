Book a = new();
Book b = new("Nice book", "John Pork");
Book c = new("Bad Book", "Stupid author", 23532525.783245);

a.DisplayBookDetails();
b.DisplayBookDetails();
c.DisplayBookDetails();
class Book
{
    public string Title { get; set; }
    public string Author { get; set; }
    public double Price { get; set; }

    public Book()
    {
        Title = "No_Title";
        Author = "No_Author";
        Price = 0.0;
    }
    public Book(string title, string author)
    {
        Title = title;
        Author = author;
        Price = 0.0;
    }
    public Book(string title, string author, double price)
    {
        Title = title;
        Author = author;
        Price = price;
    }

    public void DisplayBookDetails()
    {
        Console.WriteLine($"Title: {Title}, Author: {Author}, Price: {Price}");
    }
}