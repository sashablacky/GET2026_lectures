LogManager.DisplayLog("Application started", 100);
LogManager.DisplayLog(200, "Application finished");

class LogManager
{
    public static void DisplayLog(string message, int code)
    {
        System.Console.WriteLine($"{message} (Code: {code})");
    }
    public static void DisplayLog(int code, string message)
    {
        System.Console.WriteLine($"{code}: {message}");
    }
}