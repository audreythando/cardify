namespace Cardify.Api.Models;

public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string MerchantName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Completed";

    public Guid CreditCardId { get; set; }

    public CreditCard? CreditCard { get; set; }
}