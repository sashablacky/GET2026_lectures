int balance = 10000;

Console.WriteLine("Account Balance: " + balance);
Console.Write("Enter withdrawal amount: ");
int withdrawal = int.Parse(Console.ReadLine());

if (withdrawal <= 0) {
    Console.WriteLine("Enter a positive withdrawal amount.");
} else if (withdrawal > balance) {
    Console.WriteLine("Insufficient balance.");
} else {
    balance = balance - withdrawal;
    Console.WriteLine("Withdrawal Successful!");
    Console.WriteLine("Remaining Balance: " + balance);
}
