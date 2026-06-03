namespace Cardify.Api.DTOs.Dashboard;

public class SpendingByCategoryResponse
{
    public string Category { get; set; } = string.Empty;

    public decimal TotalSpent { get; set; }
}