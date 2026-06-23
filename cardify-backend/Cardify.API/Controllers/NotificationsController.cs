using Cardify.Api.Data;
using Cardify.Api.DTOs.Notifications;
using Cardify.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = GetCurrentUserId();

        var settings = await _context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        await GenerateNotificationsAsync(userId, settings);

        var enabledCategories = EnabledCategories(settings);

        var items = await _context.Notifications
            .Where(n => n.UserId == userId && enabledCategories.Contains(n.Category))
            .OrderByDescending(n => n.CreatedAt)
            .Take(30)
            .Select(n => new NotificationResponse
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                Category = n.Category,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(new NotificationFeedResponse
        {
            Items = items,
            UnreadCount = items.Count(i => !i.IsRead)
        });
    }

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        var userId = GetCurrentUserId();

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (notification is null)
        {
            return NotFound();
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var userId = GetCurrentUserId();

        var unread = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unread)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }


    private async Task GenerateNotificationsAsync(Guid userId, UserSettings? settings)
    {
        var enabled = EnabledCategories(settings);

        // Existing keys so we never insert the same event twice.
        var existingKeys = await _context.Notifications
            .Where(n => n.UserId == userId)
            .Select(n => n.ReferenceKey)
            .ToListAsync();

        var keySet = new HashSet<string>(existingKeys);
        var toAdd = new List<Notification>();
        var period = DateTime.UtcNow.ToString("yyyyMM");

        // Budget warnings / exceeded
        if (enabled.Contains("BudgetWarning"))
        {
            var budgets = await _context.Budgets
                .Where(b => b.UserId == userId)
                .ToListAsync();

            foreach (var b in budgets)
            {
                var usage = b.LimitAmount == 0
                    ? 0
                    : Math.Round((b.CurrentSpent / b.LimitAmount) * 100, 0);

                if (usage >= 100)
                {
                    var key = $"budget-exceeded:{b.Category}:{period}";
                    if (keySet.Add(key))
                    {
                        toAdd.Add(new Notification
                        {
                            UserId = userId,
                            Title = "Budget Exceeded",
                            Message = $"You've gone over your {b.Category} budget by R{(b.CurrentSpent - b.LimitAmount):N2}.",
                            Type = "Alert",
                            Category = "BudgetWarning",
                            ReferenceKey = key
                        });
                    }
                }
                else if (usage >= 80)
                {
                    var key = $"budget-warning:{b.Category}:{period}";
                    if (keySet.Add(key))
                    {
                        toAdd.Add(new Notification
                        {
                            UserId = userId,
                            Title = "Budget Warning",
                            Message = $"You've used {usage}% of your {b.Category} budget.",
                            Type = "Warning",
                            Category = "BudgetWarning",
                            ReferenceKey = key
                        });
                    }
                }
            }
        }

        var needsTransactions = enabled.Contains("AiInsight")
            || enabled.Contains("UnusualActivity")
            || enabled.Contains("SpendingAlert");

        if (needsTransactions)
        {
            var transactions = await _context.Transactions
                .Include(t => t.CreditCard)
                .Where(t => t.CreditCard!.UserId == userId)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            if (enabled.Contains("AiInsight") && transactions.Count > 0)
            {
                var top = transactions
                    .Where(t => !string.IsNullOrWhiteSpace(t.Category))
                    .GroupBy(t => t.Category)
                    .Select(g => new { Category = g.Key, Total = g.Sum(t => t.Amount) })
                    .OrderByDescending(x => x.Total)
                    .FirstOrDefault();

                if (top is not null)
                {
                    var key = $"top-category:{period}";
                    if (keySet.Add(key))
                    {
                        toAdd.Add(new Notification
                        {
                            UserId = userId,
                            Title = "Top Spending Category",
                            Message = $"{top.Category} is your highest spend this period at R{top.Total:N2}.",
                            Type = "Info",
                            Category = "AiInsight",
                            ReferenceKey = key
                        });
                    }
                }
            }

            if (enabled.Contains("UnusualActivity") && transactions.Count >= 3)
            {
                var average = transactions.Average(t => t.Amount);
                var threshold = average * 2;

                var unusual = transactions
                    .Where(t => t.Amount > threshold && t.Amount > 0)
                    .Take(3);

                foreach (var t in unusual)
                {
                    var key = $"unusual:{t.Id}";
                    if (keySet.Add(key))
                    {
                        toAdd.Add(new Notification
                        {
                            UserId = userId,
                            Title = "Unusual Transaction",
                            Message = $"R{t.Amount:N2} at {t.MerchantName} is higher than your usual spend.",
                            Type = "Alert",
                            Category = "UnusualActivity",
                            ReferenceKey = key
                        });
                    }
                }
            }

            if (enabled.Contains("SpendingAlert") && transactions.Count > 0)
            {
                var latest = transactions.First();
                var key = $"txn:{latest.Id}";
                if (keySet.Add(key))
                {
                    toAdd.Add(new Notification
                    {
                        UserId = userId,
                        Title = "New Transaction",
                        Message = $"R{latest.Amount:N2} spent at {latest.MerchantName}.",
                        Type = "Info",
                        Category = "SpendingAlert",
                        ReferenceKey = key
                    });
                }
            }
        }

        if (toAdd.Count > 0)
        {
            _context.Notifications.AddRange(toAdd);
            await _context.SaveChangesAsync();
        }
    }

    private static HashSet<string> EnabledCategories(UserSettings? settings)
    {
        if (settings is null)
        {
            return new HashSet<string>
            {
                "BudgetWarning", "SpendingAlert", "AiInsight", "UnusualActivity", "WeeklyReport"
            };
        }

        var set = new HashSet<string>();
        if (settings.BudgetWarnings) set.Add("BudgetWarning");
        if (settings.SpendingAlerts) set.Add("SpendingAlert");
        if (settings.AiInsightsNotifications) set.Add("AiInsight");
        if (settings.UnusualActivity) set.Add("UnusualActivity");
        if (settings.WeeklyReport) set.Add("WeeklyReport");
        return set;
    }

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }
}