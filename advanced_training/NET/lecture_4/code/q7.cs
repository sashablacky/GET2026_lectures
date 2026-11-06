INotification email = new EmailNotification();
INotification sms = new SMSNotification();
INotification push = new PushNotification();

email.SendNotification("Your order has shipped.");
sms.SendNotification("Your verification code is 123456.");
push.SendNotification("You have a new message.");

interface INotification
{
    void SendNotification(string message);
}

class EmailNotification : INotification
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"Email notification: {message}");
    }
}

class SMSNotification : INotification
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"SMS notification: {message}");
    }
}

class PushNotification : INotification
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"Push notification: {message}");
    }
}
