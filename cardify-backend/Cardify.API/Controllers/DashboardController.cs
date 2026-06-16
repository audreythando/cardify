using Cardify.Api.Data;
using Cardify.Api.DTOs.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var userId = GetCurrentUserId();

        var cards = await _context.CreditCards
            .Where(card => card.UserId == userId)
            .ToListAsync();

        var transactions = await _context.Transactions
            .Include(transaction => transaction.CreditCard)
            .Where(transaction => transaction.CreditCard!.UserId == userId)
            .ToListAsync();

        var budgets = await _context.Budgets
            .Where(budget => budget.UserId == userId)
            .ToListAsync();

        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        var response = new DashboardSummaryResponse
        {
            TotalBalance = cards.Sum(card => card.Balance),
            TotalCreditLimit = cards.Sum(card => card.CreditLimit),
            AvailableCredit = cards.Sum(card => card.CreditLimit - card.Balance),
            TotalSpentThisMonth = transactions
                .Where(transaction => transaction.TransactionDate >= startOfMonth)
                .Sum(transaction => transaction.Amount),
            TotalCards = cards.Count,
            TotalTransactions = transactions.Count,
            TotalBudgets = budgets.Count
        };

        return Ok(response);
    }

    [HttpGet("budget-health")]
public async Task<IActionResult> GetBudgetHealth()
{
    var userId = GetCurrentUserId();

    var budgets = await _context.Budgets
        .Where(budget => budget.UserId == userId)
        .ToListAsync();

    var response = budgets.Select(budget =>
    {
        var utilizationPercentage = budget.LimitAmount == 0
            ? 0
            : Math.Round((budget.CurrentSpent / budget.LimitAmount) * 100, 2);

        var status = utilizationPercentage switch
        {
            >= 100 => "Over Budget",
            >= 80 => "Warning",
            _ => "Healthy"
        };

        return new BudgetHealthResponse
        {
            Category = budget.Category,
            LimitAmount = budget.LimitAmount,
            CurrentSpent = budget.CurrentSpent,
            RemainingAmount = budget.LimitAmount - budget.CurrentSpent,
            UtilizationPercentage = utilizationPercentage,
            Status = status
        };
    });

    return Ok(response);
}

[HttpGet("spending-by-category")]
public async Task<IActionResult> GetSpendingByCategory()
{
    var userId = GetCurrentUserId();

    var response = await _context.Transactions
        .Include(transaction => transaction.CreditCard)
        .Where(transaction => transaction.CreditCard!.UserId == userId)
        .GroupBy(transaction => transaction.Category)
        .Select(group => new SpendingByCategoryResponse
        {
            Category = group.Key,
            TotalSpent = group.Sum(transaction => transaction.Amount)
        })
        .OrderByDescending(item => item.TotalSpent)
        .ToListAsync();

    return Ok(response);
}



    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }
}