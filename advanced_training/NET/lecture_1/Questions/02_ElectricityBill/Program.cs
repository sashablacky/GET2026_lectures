Console.Write("Enter units consumed: ");
int units = int.Parse(Console.ReadLine());

double bill;

if (units <= 100) {
    bill = units * 2;
} else if (units <= 200) {
    bill = 100 * 2 + (units - 100) * 3;
} else {
    bill = 100 * 2 + 100 * 3 + (units - 200) * 5;
}

Console.WriteLine("Electricity Bill: " + bill);
