using Cardify.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Cardify.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<CreditCard> CreditCards => Set<CreditCard>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<AiInsight> AiInsights => Set<AiInsight>();

    public DbSet<UserSettings> UserSettings => Set<UserSettings>();

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<CreditCard>()
        .Property(c => c.Balance)
        .HasPrecision(18, 2);

    modelBuilder.Entity<CreditCard>()
        .Property(c => c.CreditLimit)
        .HasPrecision(18, 2);

    modelBuilder.Entity<Transaction>()
        .Property(t => t.Amount)
        .HasPrecision(18, 2);

    modelBuilder.Entity<Budget>()
        .Property(b => b.LimitAmount)
        .HasPrecision(18, 2);

    modelBuilder.Entity<Budget>()
        .Property(b => b.CurrentSpent)
        .HasPrecision(18, 2);
}
}