namespace Cardify.Api.DTOs.Dashboard;

public class BudgetHealthResponse
{
    public string Category { get; set; } = string.Empty;

    public decimal LimitAmount { get; set; }

    public decimal CurrentSpent { get; set; }

    public decimal RemainingAmount { get; set; }

    public decimal UtilizationPercentage { get; set; }

    public string Status { get; set; } = string.Empty;
}