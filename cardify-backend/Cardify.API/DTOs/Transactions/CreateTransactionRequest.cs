namespace Cardify.Api.DTOs.Transactions;

public class CreateTransactionRequest
{
    public Guid CreditCardId { get; set; }

    public string MerchantName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }
}