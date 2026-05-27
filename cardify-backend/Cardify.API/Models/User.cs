namespace Cardify.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<CreditCard> CreditCards { get; set; } = new();

    public List<Budget> Budgets { get; set; } = new();
}