namespace Cardify.Api.DTOs.Budgets;

public class BudgetResponse
{
    public Guid Id { get; set; }

    public string Category { get; set; } = string.Empty;

    public decimal LimitAmount { get; set; }

    public decimal CurrentSpent { get; set; }

    public decimal RemainingAmount => LimitAmount - CurrentSpent;

    public DateTime Month { get; set; }
}