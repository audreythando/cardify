using Cardify.Api.Data;
using Cardify.Api.DTOs.Transactions;
using Cardify.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction(CreateTransactionRequest request)
    {
        var userId = GetCurrentUserId();

        var card = await _context.CreditCards
            .FirstOrDefaultAsync(card =>
                card.Id == request.CreditCardId &&
                card.UserId == userId);

        if (card is null)
        {
            return NotFound("Card not found.");
        }

        var transaction = new Transaction
        {
            CreditCardId = request.CreditCardId,
            MerchantName = request.MerchantName,
            Category = request.Category,
            Amount = request.Amount,
            TransactionDate = DateTime.UtcNow,
            Status = "Completed"
        };
        _context.Transactions.Add(transaction);

        card.Balance += request.Amount;

        var budget = await _context.Budgets
            .FirstOrDefaultAsync(budget =>
                budget.UserId == userId &&
                budget.Category.ToLower() == request.Category.ToLower());

        if (budget is not null)
        {
            budget.CurrentSpent += request.Amount;
        }

        await _context.SaveChangesAsync();

        return Ok(ToResponse(transaction));
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var userId = GetCurrentUserId();

        var transactions = await _context.Transactions
            .Include(transaction => transaction.CreditCard)
            .Where(transaction => transaction.CreditCard!.UserId == userId)
            .OrderByDescending(transaction => transaction.TransactionDate)
            .Select(transaction => new TransactionResponse
            {
                Id = transaction.Id,
                CreditCardId = transaction.CreditCardId,
                MerchantName = transaction.MerchantName,
                Category = transaction.Category,
                Amount = transaction.Amount,
                TransactionDate = transaction.TransactionDate,
                Status = transaction.Status
            })
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransactionById(Guid id)
    {
        var userId = GetCurrentUserId();

        var transaction = await _context.Transactions
            .Include(transaction => transaction.CreditCard)
            .Where(transaction =>
                transaction.Id == id &&
                transaction.CreditCard!.UserId == userId)
            .Select(transaction => new TransactionResponse
            {
                Id = transaction.Id,
                CreditCardId = transaction.CreditCardId,
                MerchantName = transaction.MerchantName,
                Category = transaction.Category,
                Amount = transaction.Amount,
                TransactionDate = transaction.TransactionDate,
                Status = transaction.Status
            })
            .FirstOrDefaultAsync();

        if (transaction is null)
        {
            return NotFound("Transaction not found.");
        }

        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(
        Guid id,
        UpdateTransactionRequest request)
    {
        var userId = GetCurrentUserId();

        var transaction = await _context.Transactions
            .Include(transaction => transaction.CreditCard)
            .FirstOrDefaultAsync(transaction =>
                transaction.Id == id &&
                transaction.CreditCard!.UserId == userId);

        if (transaction is null)
        {
            return NotFound("Transaction not found.");
        }

        transaction.MerchantName = request.MerchantName;
        transaction.Category = request.Category;
        transaction.Amount = request.Amount;
        transaction.Status = request.Status;

        await _context.SaveChangesAsync();

        return Ok(ToResponse(transaction));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var userId = GetCurrentUserId();

        var transaction = await _context.Transactions
            .Include(transaction => transaction.CreditCard)
            .FirstOrDefaultAsync(transaction =>
                transaction.Id == id &&
                transaction.CreditCard!.UserId == userId);

        if (transaction is null)
        {
            return NotFound("Transaction not found.");
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static TransactionResponse ToResponse(Transaction transaction)
    {
        return new TransactionResponse
        {
            Id = transaction.Id,
            CreditCardId = transaction.CreditCardId,
            MerchantName = transaction.MerchantName,
            Category = transaction.Category,
            Amount = transaction.Amount,
            TransactionDate = transaction.TransactionDate,
            Status = transaction.Status
        };
    }

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.Parse(userId!);
    }
}