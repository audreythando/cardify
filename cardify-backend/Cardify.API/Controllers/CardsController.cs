using Cardify.Api.Data;
using Cardify.Api.DTOs.Cards;
using Cardify.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CardsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CardsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCards()
    {
        var userId = GetCurrentUserId();

        var cards = await _context.CreditCards
            .Where(card => card.UserId == userId)
            .Select(card => new CardResponse
            {
                Id = card.Id,
                CardHolderName = card.CardHolderName,
                CardNumber = card.CardNumber,
                CardType = card.CardType,
                Balance = card.Balance,
                CreditLimit = card.CreditLimit,
                ExpiryDate = card.ExpiryDate,
                IsActive = card.IsActive
            })
            .ToListAsync();

        return Ok(cards);
    }

    [HttpGet("{id}")]
public async Task<IActionResult> GetCardById(Guid id)
{
    var userId = GetCurrentUserId();

    var card = await _context.CreditCards
        .Where(card => card.Id == id && card.UserId == userId)
        .Select(card => new CardResponse
        {
            Id = card.Id,
            CardHolderName = card.CardHolderName,
            CardNumber = card.CardNumber,
            CardType = card.CardType,
            Balance = card.Balance,
            CreditLimit = card.CreditLimit,
            ExpiryDate = card.ExpiryDate,
            IsActive = card.IsActive
        })
        .FirstOrDefaultAsync();

    if (card is null)
    {
        return NotFound("Card not found.");
    }

    return Ok(card);
}

[HttpPut("{id}")]
public async Task<IActionResult> UpdateCard(Guid id, UpdateCardRequest request)
{
    var userId = GetCurrentUserId();

    var card = await _context.CreditCards
        .FirstOrDefaultAsync(card => card.Id == id && card.UserId == userId);

    if (card is null)
    {
        return NotFound("Card not found.");
    }

    card.CardHolderName = request.CardHolderName;
    card.CardType = request.CardType;
    card.Balance = request.Balance;
    card.CreditLimit = request.CreditLimit;
    card.ExpiryDate = request.ExpiryDate;
    card.IsActive = request.IsActive;

    await _context.SaveChangesAsync();

    return Ok(new CardResponse
    {
        Id = card.Id,
        CardHolderName = card.CardHolderName,
        CardNumber = card.CardNumber,
        CardType = card.CardType,
        Balance = card.Balance,
        CreditLimit = card.CreditLimit,
        ExpiryDate = card.ExpiryDate,
        IsActive = card.IsActive
    });
}

    [HttpPost]
    public async Task<IActionResult> CreateCard(CreateCardRequest request)
    {
        var userId = GetCurrentUserId();

        var card = new CreditCard
        {
            CardHolderName = request.CardHolderName,
            CardNumber = request.CardNumber,
            CardType = request.CardType,
            Balance = request.Balance,
            CreditLimit = request.CreditLimit,
            ExpiryDate = request.ExpiryDate,
            UserId = userId
        };

        _context.CreditCards.Add(card);
        await _context.SaveChangesAsync();

        return Ok(new CardResponse
        {
            Id = card.Id,
            CardHolderName = card.CardHolderName,
            CardNumber = card.CardNumber,
            CardType = card.CardType,
            Balance = card.Balance,
            CreditLimit = card.CreditLimit,
            ExpiryDate = card.ExpiryDate,
            IsActive = card.IsActive
        });
    }

    [HttpDelete("{id}")]
public async Task<IActionResult> DeleteCard(Guid id)
{
    var userId = GetCurrentUserId();

    var card = await _context.CreditCards
        .FirstOrDefaultAsync(card => card.Id == id && card.UserId == userId);

    if (card is null)
    {
        return NotFound("Card not found.");
    }

    _context.CreditCards.Remove(card);
    await _context.SaveChangesAsync();

    return NoContent();
}

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.Parse(userId!);
    }
}