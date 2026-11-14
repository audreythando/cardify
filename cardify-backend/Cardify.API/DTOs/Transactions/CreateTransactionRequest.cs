using System.ComponentModel.DataAnnotations;
using Cardify.Api.Validation;

namespace Cardify.Api.DTOs.Transactions;

public class CreateTransactionRequest
{
    [Required(ErrorMessage = "Card is required.")]
    public Guid CreditCardId { get; set; }

    [Required(ErrorMessage = "Merchant name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Merchant name must be between 2 and 100 characters.")]
    public string MerchantName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [SpendingCategory]
    public string Category { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "1000000", ErrorMessage = "Amount must be between R0.01 and R1,000,000.")]
    public decimal Amount { get; set; }
}
