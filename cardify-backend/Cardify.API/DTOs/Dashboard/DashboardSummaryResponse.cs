namespace Cardify.Api.DTOs.Dashboard;

public class DashboardSummaryResponse
{
    public decimal TotalBalance { get; set; }

    public decimal TotalCreditLimit { get; set; }

    public decimal AvailableCredit { get; set; }

    public decimal TotalSpentThisMonth { get; set; }

    public int TotalCards { get; set; }

    public int TotalTransactions { get; set; }

    public int TotalBudgets { get; set; }
}