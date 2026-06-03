namespace Cardify.Api.DTOs.Transactions;

public class TransactionResponse
{
    public Guid Id { get; set; }

    public Guid CreditCardId { get; set; }

    public string MerchantName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime TransactionDate { get; set; }

    public string Status { get; set; } = string.Empty;
}