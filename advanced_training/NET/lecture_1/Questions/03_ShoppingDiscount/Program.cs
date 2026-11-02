Console.Write("Enter product name: ");
string productName = Console.ReadLine();

Console.Write("Enter product price: ");
double price = double.Parse(Console.ReadLine());

Console.Write("Enter quantity: ");
int quantity = int.Parse(Console.ReadLine());

double total = price * quantity;
double discount = 0;

if (total > 5000) {
    discount = total * 0.10;
}

double finalAmount = total - discount;

Console.WriteLine("Product: " + productName);
Console.WriteLine("Total: " + total);
Console.WriteLine("Discount: " + discount);
Console.WriteLine("Final Amount: " + finalAmount);
