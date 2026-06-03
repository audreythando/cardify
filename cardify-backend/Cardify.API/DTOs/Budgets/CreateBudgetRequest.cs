namespace Cardify.Api.DTOs.Budgets;

public class CreateBudgetRequest
{
    public string Category { get; set; } = string.Empty;

    public decimal LimitAmount { get; set; }
}