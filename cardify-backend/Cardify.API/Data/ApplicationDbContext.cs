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
}