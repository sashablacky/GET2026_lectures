Dictionary<string, int> bookInventory = new Dictionary<string, int>();

bookInventory.Add("The Great Gatsby", 5);
bookInventory["The Great Gatsby"] = 10;
Console.WriteLine(bookInventory["The Great Gatsby"]);
bookInventory.Remove("The Great Gatsby");
foreach (var book in bookInventory) {
    Console.WriteLine($"Book: {book.Key}, Quantity: {book.Value}");
}

Console.WriteLine(bookInventory.ContainsKey("The Great Gatsby") ? "The Great Gatsby is in the inventory." : "The Great Gatsby is not in the inventory.");