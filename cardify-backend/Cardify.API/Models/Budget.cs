namespace Cardify.Api.Models;

public class Budget
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Category { get; set; } = string.Empty;

    public decimal LimitAmount { get; set; }

    public decimal CurrentSpent { get; set; }

    public DateTime Month { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }

    public User? User { get; set; }
}