Payment[] payments =
{
    new CreditCardPayment(100m),
    new UPIPayment(75m),
    new CashPayment(25m)
};

foreach (Payment payment in payments)
{
    payment.ProcessPayment();
}

class Payment(decimal amount)
{
    public decimal Amount { get; set; } = amount;

    public virtual void ProcessPayment() { }
}

class CreditCardPayment(decimal amount) : Payment(amount)
{
    public override void ProcessPayment()
    {
        Console.WriteLine($"Processing credit card payment of {Amount:C}.");
    }
}

class UPIPayment(decimal amount) : Payment(amount)
{
    public override void ProcessPayment()
    {
        Console.WriteLine($"Processing UPI payment of {Amount:C}.");
    }
}

class CashPayment(decimal amount) : Payment(amount)
{
    public override void ProcessPayment()
    {
        Console.WriteLine($"Processing cash payment of {Amount:C}.");
    }
}
