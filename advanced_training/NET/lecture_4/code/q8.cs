IPayment razorpayPayment = new RazorpayPayment();
IRefund razorpayRefund = (IRefund)razorpayPayment;
razorpayPayment.Pay(100.00);
razorpayRefund.Refund(25.00);

IPayment stripePayment = new StripePayment();
IRefund stripeRefund = (IRefund)stripePayment;
stripePayment.Pay(200.00);
stripeRefund.Refund(50.00);

interface IPayment
{
    void Pay(double amount);
}

interface IRefund
{
    void Refund(double amount);
}

class RazorpayPayment : IPayment, IRefund
{
    public void Pay(double amount)
    {
        Console.WriteLine($"Razorpay: Paid {amount}");
    }

    public void Refund(double amount)
    {
        Console.WriteLine($"Razorpay: Refunded {amount}");
    }
}

class StripePayment : IPayment, IRefund
{
    public void Pay(double amount)
    {
        Console.WriteLine($"Stripe: Paid {amount}");
    }

    public void Refund(double amount)
    {
        Console.WriteLine($"Stripe: Refunded {amount}");
    }
}