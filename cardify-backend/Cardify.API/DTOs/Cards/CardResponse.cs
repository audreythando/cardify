namespace Cardify.Api.DTOs.Cards;

public class CardResponse
{
    public Guid Id { get; set; }

    public string CardHolderName { get; set; } = string.Empty;

    public string CardNumber { get; set; } = string.Empty;

    public string CardType { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    public decimal CreditLimit { get; set; }

    public decimal AvailableCredit => CreditLimit - Balance;

    public DateTime ExpiryDate { get; set; }

    public bool IsActive { get; set; }
}