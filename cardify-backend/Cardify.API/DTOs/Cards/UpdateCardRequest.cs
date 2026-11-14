using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.DTOs.Cards;

public class UpdateCardRequest
{
    [Required(ErrorMessage = "Cardholder name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Cardholder name must be between 2 and 100 characters.")]
    public string CardHolderName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Card type is required.")]
    [RegularExpression("(?i)^(visa|mastercard|amex)$", ErrorMessage = "Card type must be Visa, Mastercard or Amex.")]
    public string CardType { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "10000000", ErrorMessage = "Balance must be between R0 and R10,000,000.")]
    public decimal Balance { get; set; }

    [Range(typeof(decimal), "1", "10000000", ErrorMessage = "Credit limit must be between R1 and R10,000,000.")]
    public decimal CreditLimit { get; set; }

    [Required(ErrorMessage = "Expiry date is required.")]
    public DateTime ExpiryDate { get; set; }

    public bool IsActive { get; set; }
}
