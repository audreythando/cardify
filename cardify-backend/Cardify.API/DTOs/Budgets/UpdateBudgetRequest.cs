namespace Cardify.Api.DTOs.Budgets;

public class UpdateBudgetRequest
{
    public string Category { get; set; } = string.Empty;

    public decimal LimitAmount { get; set; }
}