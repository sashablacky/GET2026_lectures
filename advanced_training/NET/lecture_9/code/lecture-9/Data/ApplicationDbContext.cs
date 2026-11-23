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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MeterInfo>(entity =>
        {
            entity.HasIndex(meter => meter.SerialNumber).IsUnique();
            entity.Property(meter => meter.CurrentReading).HasPrecision(12, 2);
        });

        modelBuilder.Entity<CommandLog>(entity =>
        {
            entity.HasKey(log => log.Id);
            entity.HasOne(log => log.MeterInfo)
                .WithMany(meter => meter.CommandLogs)
                .HasForeignKey(log => log.MeterInfoId);
        });
    }
}