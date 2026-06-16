using Cardify.Api.Data;
using Cardify.Api.DTOs.Ai;
using Cardify.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly OllamaService _ollamaService;
    private readonly ApplicationDbContext _context;

    public AiController(OllamaService ollamaService, ApplicationDbContext context)
    {
        _ollamaService = ollamaService;
        _context = context;
    }

    [HttpPost("financial-insight")]
    public async Task<IActionResult> GenerateFinancialInsight(AiFinancialInsightRequest request)
    {
        var insight = await _ollamaService.GenerateFinancialInsightAsync(request.Prompt);

        return Ok(new { insight });
    }

    [HttpPost("cardify-advice")]
    public async Task<IActionResult> GenerateCardifyAdvice(CardifyAdviceRequest request)
    {
        var userId = GetCurrentUserId();

        var cards = await _context.CreditCards
            .Where(card => card.UserId == userId)
            .ToListAsync();

        var transactions = await _context.Transactions
            .Include(transaction => transaction.CreditCard)
            .Where(transaction => transaction.CreditCard!.UserId == userId)
            .OrderByDescending(transaction => transaction.TransactionDate)
            .Take(10)
            .ToListAsync();

        var budgets = await _context.Budgets
            .Where(budget => budget.UserId == userId)
            .ToListAsync();

        var totalBalance = cards.Sum(card => card.Balance);
        var totalCreditLimit = cards.Sum(card => card.CreditLimit);
        var availableCredit = cards.Sum(card => card.CreditLimit - card.Balance);

        var utilisation = totalCreditLimit == 0
            ? 0
            : Math.Round((totalBalance / totalCreditLimit) * 100, 2);

        var spendingByCategory = transactions
            .Where(transaction => !string.IsNullOrWhiteSpace(transaction.Category))
            .GroupBy(transaction => transaction.Category)
            .Select(group => new SpendingCategorySummary
            {
                Category = group.Key,
                Total = group.Sum(transaction => transaction.Amount)
            })
            .OrderByDescending(item => item.Total)
            .ToList();

        var financialContext = BuildFinancialContext(
            cards,
            transactions,
            budgets,
            spendingByCategory,
            totalBalance,
            totalCreditLimit,
            availableCredit,
            utilisation
        );

        var insight = await _ollamaService.GenerateCardifyAdviceAsync(
            financialContext,
            request.Question
        );

        return Ok(new { insight });
    }

    private static string BuildFinancialContext(
        List<Models.CreditCard> cards,
        List<Models.Transaction> transactions,
        List<Models.Budget> budgets,
        List<SpendingCategorySummary> spendingByCategory,
        decimal totalBalance,
        decimal totalCreditLimit,
        decimal availableCredit,
        decimal utilisation)
    {
        var builder = new StringBuilder();

        builder.AppendLine($"Total Balance: R{totalBalance:N2}");
        builder.AppendLine($"Total Credit Limit: R{totalCreditLimit:N2}");
        builder.AppendLine($"Available Credit: R{availableCredit:N2}");
        builder.AppendLine($"Credit Utilisation: {utilisation}%");
        builder.AppendLine();

        builder.AppendLine("Cards:");
        foreach (var card in cards)
        {
            var lastFour = string.IsNullOrWhiteSpace(card.CardNumber) || card.CardNumber.Length < 4
                ? "0000"
                : card.CardNumber[^4..];

            builder.AppendLine(
                $"- {card.CardType} ending in {lastFour}: Balance R{card.Balance:N2}, Limit R{card.CreditLimit:N2}"
            );
        }

        builder.AppendLine();
        builder.AppendLine("Budgets:");
        foreach (var budget in budgets)
        {
            var remaining = budget.LimitAmount - budget.CurrentSpent;
            var budgetUsage = budget.LimitAmount == 0
                ? 0
                : Math.Round((budget.CurrentSpent / budget.LimitAmount) * 100, 2);

            builder.AppendLine(
                $"- {budget.Category}: Spent R{budget.CurrentSpent:N2} of R{budget.LimitAmount:N2}, Remaining R{remaining:N2}, Usage {budgetUsage}%"
            );
        }

        builder.AppendLine();
        builder.AppendLine("Spending By Category:");
        foreach (var item in spendingByCategory)
        {
            builder.AppendLine($"- {item.Category}: R{item.Total:N2}");
        }

        builder.AppendLine();
        builder.AppendLine("Recent Transactions:");
        foreach (var transaction in transactions)
        {
            builder.AppendLine(
                $"- {transaction.TransactionDate:dd MMM yyyy}: {transaction.MerchantName}, {transaction.Category}, R{transaction.Amount:N2}"
            );
        }

        return builder.ToString();
    }

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }

    private class SpendingCategorySummary
    {
        public string Category { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}