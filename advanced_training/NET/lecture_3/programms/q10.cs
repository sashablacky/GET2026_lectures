BankAccount account = new BankAccount(1000m, "Alex", 12345);
account.Deposit(500m);
account.Withdraw(200m);
account.DisplayAccountDetails();

class BankAccount
{
    private decimal balance;
    public string AccountHolder { get; set; }
    public int AccountNumber { get; private set; }
    public decimal Balance => balance;

    public BankAccount(decimal balance, string accountholder, int accountnumber)
    {
        this.balance = balance;
        AccountHolder = accountholder;
        AccountNumber = accountnumber;
    }

    public void Deposit(decimal amount)
    {
        if (amount > 0)
        {
            this.balance += amount;
        }
        else
        {
            Console.WriteLine("Ammount must be positive");
        }

    }
    public void Withdraw(decimal amount)
    {
        if (this.balance >= amount)
        {
            this.balance -= amount;
        }
        else
        {
            Console.WriteLine("Not enough money in accout you broke");
        }
    }

    public void DisplayAccountDetails()
    {
        Console.WriteLine($"Account Holder: {AccountHolder}");
        Console.WriteLine($"Account Number: {AccountNumber}");
        Console.WriteLine($"Balance: {Balance:C}");
    }
}
