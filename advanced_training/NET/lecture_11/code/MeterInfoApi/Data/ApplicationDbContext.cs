using Lecture9Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Lecture9Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<MeterInfo> MeterInfos { get; set; }
    public DbSet<CommandLog> CommandLogs { get; set; }
    public DbSet<MeterReading> MeterReadings { get; set; }
    public DbSet<ImportJob> ImportJobs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MeterInfo>(entity =>
        {
            entity.HasIndex(meter => meter.MeterNumber).IsUnique();
            entity.Property(meter => meter.Status)
                .HasConversion<string>()
                .HasMaxLength(20);
            entity.HasMany(meter => meter.CommandLogs)
                .WithOne(log => log.MeterInfo)
                .HasForeignKey(log => log.MeterInfoId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CommandLog>(entity =>
        {
            entity.HasKey(log => log.Id);
            entity.Property(log => log.Status)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        modelBuilder.Entity<MeterReading>(entity =>
        {
            entity.HasKey(reading => reading.Id);
            entity.Property(reading => reading.Reading)
                .HasPrecision(18, 4);
            entity.HasOne(reading => reading.MeterInfo)
                .WithMany(meter => meter.MeterReadings)
                .HasForeignKey(reading => reading.MeterInfoId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}