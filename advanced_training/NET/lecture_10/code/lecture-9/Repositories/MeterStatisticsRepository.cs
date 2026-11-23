using Npgsql;

namespace Lecture9Api.Repositories;

public class MeterStatisticsRepository : IMeterStatisticsRepository
{
    private readonly string _connectionString;

    public MeterStatisticsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection is not configured.");
    }

    public async Task<int> GetTotalMetersAsync(CancellationToken cancellationToken = default) =>
        await ExecuteScalarAsync<int>("SELECT COUNT(*) FROM \"MeterInfos\"", cancellationToken);

    public async Task<int> GetActiveMetersByLocationAsync(string location, CancellationToken cancellationToken = default)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new NpgsqlCommand(
            "SELECT COUNT(*) FROM \"MeterInfos\" WHERE \"Status\" = @status AND \"Location\" = @location",
            connection);
        command.Parameters.AddWithValue("status", "Active");
        command.Parameters.AddWithValue("location", location);
        return Convert.ToInt32(await command.ExecuteScalarAsync(cancellationToken));
    }

    public async Task<decimal?> GetAverageReadingAsync(CancellationToken cancellationToken = default) =>
        await ExecuteNullableDecimalAsync("SELECT AVG(\"Reading\") FROM \"MeterReadings\"", cancellationToken);

    public async Task<decimal?> GetMinimumReadingAsync(CancellationToken cancellationToken = default) =>
        await ExecuteNullableDecimalAsync("SELECT MIN(\"Reading\") FROM \"MeterReadings\"", cancellationToken);

    public async Task<decimal?> GetMaximumReadingAsync(CancellationToken cancellationToken = default) =>
        await ExecuteNullableDecimalAsync("SELECT MAX(\"Reading\") FROM \"MeterReadings\"", cancellationToken);

    public async Task<int> GetReadingCountInRangeAsync(DateTime start, DateTime end, CancellationToken cancellationToken = default)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new NpgsqlCommand(
            "SELECT COUNT(*) FROM \"MeterReadings\" WHERE \"RecordedAt\" >= @start AND \"RecordedAt\" <= @end",
            connection);
        command.Parameters.AddWithValue("start", start.ToUniversalTime());
        command.Parameters.AddWithValue("end", end.ToUniversalTime());
        return Convert.ToInt32(await command.ExecuteScalarAsync(cancellationToken));
    }

    private async Task<T> ExecuteScalarAsync<T>(string sql, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new NpgsqlCommand(sql, connection);
        var value = await command.ExecuteScalarAsync(cancellationToken);
        if (value is null || value is DBNull)
            return default!;
        return (T)Convert.ChangeType(value, typeof(T));
    }

    private async Task<decimal?> ExecuteNullableDecimalAsync(string sql, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new NpgsqlCommand(sql, connection);
        var value = await command.ExecuteScalarAsync(cancellationToken);
        return value is DBNull or null ? null : Convert.ToDecimal(value);
    }
}
