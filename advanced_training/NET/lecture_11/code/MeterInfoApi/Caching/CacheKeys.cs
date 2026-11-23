namespace Lecture9Api.Caching;

public static class CacheKeys
{
    public const string AllMeters = "meters:all";

    public static string MeterById(int id) => $"meters:{id}";
    public static string CommandLogsByMeter(int meterId) => $"meters:{meterId}:command-logs";
    public static string MeterSummary = "meters:summary";
    public static string MeterHistory = "meters:history";
}
