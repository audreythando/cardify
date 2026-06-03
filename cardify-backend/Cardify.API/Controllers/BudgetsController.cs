using Cardify.Api.Data;
using Cardify.Api.DTOs.Budgets;
using Cardify.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BudgetsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBudget(CreateBudgetRequest request)
    {
        var userId = GetCurrentUserId();

        var budget = new Budget
        {
            Category = request.Category,
            LimitAmount = request.LimitAmount,
            CurrentSpent = 0,
            Month = DateTime.UtcNow,
            UserId = userId
        };

        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();

        return Ok(ToResponse(budget));
    }

    [HttpGet]
    public async Task<IActionResult> GetBudgets()
    {
        var userId = GetCurrentUserId();

        var budgets = await _context.Budgets
            .Where(budget => budget.UserId == userId)
            .OrderBy(budget => budget.Category)
            .Select(budget => new BudgetResponse
            {
                Id = budget.Id,
                Category = budget.Category,
                LimitAmount = budget.LimitAmount,
                CurrentSpent = budget.CurrentSpent,
                Month = budget.Month
            })
            .ToListAsync();

        return Ok(budgets);
    }

    [HttpGet("{id}")]
public async Task<IActionResult> GetBudgetById(Guid id)
{
    var userId = GetCurrentUserId();

    var budget = await _context.Budgets
        .Where(budget => budget.Id == id && budget.UserId == userId)
        .Select(budget => new BudgetResponse
        {
            Id = budget.Id,
            Category = budget.Category,
            LimitAmount = budget.LimitAmount,
            CurrentSpent = budget.CurrentSpent,
            Month = budget.Month
        })
        .FirstOrDefaultAsync();

    if (budget is null)
    {
        return NotFound("Budget not found.");
    }

    return Ok(budget);
}

[HttpPut("{id}")]
public async Task<IActionResult> UpdateBudget(
    Guid id,
    UpdateBudgetRequest request)
{
    var userId = GetCurrentUserId();

    var budget = await _context.Budgets
        .FirstOrDefaultAsync(budget =>
            budget.Id == id &&
            budget.UserId == userId);

    if (budget is null)
    {
        return NotFound("Budget not found.");
    }

    budget.Category = request.Category;
    budget.LimitAmount = request.LimitAmount;

    await _context.SaveChangesAsync();

    return Ok(ToResponse(budget));
}

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteBudget(Guid id)
{
    var userId = GetCurrentUserId();

    var budget = await _context.Budgets
        .FirstOrDefaultAsync(budget =>
            budget.Id == id &&
            budget.UserId == userId);

    if (budget is null)
    {
        return NotFound("Budget not found.");
    }

    _context.Budgets.Remove(budget);
    await _context.SaveChangesAsync();

    return NoContent();
}

    private static BudgetResponse ToResponse(Budget budget)
    {
        return new BudgetResponse
        {
            Id = budget.Id,
            Category = budget.Category,
            LimitAmount = budget.LimitAmount,
            CurrentSpent = budget.CurrentSpent,
            Month = budget.Month
        };
    }

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }
}