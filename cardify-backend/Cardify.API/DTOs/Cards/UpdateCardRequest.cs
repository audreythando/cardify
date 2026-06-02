namespace Cardify.Api.DTOs.Cards;

public class UpdateCardRequest
{
    public string CardHolderName { get; set; } = string.Empty;

    public string CardType { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    public decimal CreditLimit { get; set; }

    public DateTime ExpiryDate { get; set; }

    public bool IsActive { get; set; }
}