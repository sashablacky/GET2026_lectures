Console.WriteLine("1. Regular - 150");
Console.WriteLine("2. Premium - 250");
Console.WriteLine("3. VIP - 400");
Console.Write("Choose a category: ");
int choice = int.Parse(Console.ReadLine());

string category;
int price;

switch (choice) {
    case 1:
        category = "Regular";
        price = 150;
        break;
    case 2:
        category = "Premium";
        price = 250;
        break;
    case 3:
        category = "VIP";
        price = 400;
        break;
    default:
        Console.WriteLine("Invalid category.");
        return;
}

Console.Write("Enter number of tickets: ");
int tickets = int.Parse(Console.ReadLine());
int total = price * tickets;

Console.WriteLine("Category: " + category);
Console.WriteLine("Tickets: " + tickets);
Console.WriteLine("Total Price: " + total);
