namespace Cardify.Api.DTOs.Transactions;

public class UpdateTransactionRequest
{
    public string MerchantName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Status { get; set; } = string.Empty;
}