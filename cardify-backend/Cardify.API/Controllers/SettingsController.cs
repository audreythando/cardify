using Cardify.Api.Data;
using Cardify.Api.DTOs.Settings;
using Cardify.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var userId = GetCurrentUserId();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        var settings = await GetOrCreateSettingsAsync(userId);

        return Ok(MapToResponse(user, settings));
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        // Reject an email already used by a different account.
        var emailTaken = await _context.Users
            .AnyAsync(u => u.Email == request.Email && u.Id != userId);

        if (emailTaken)
        {
            return Conflict(new { message = "That email is already in use." });
        }

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;

        await _context.SaveChangesAsync();

        var settings = await GetOrCreateSettingsAsync(userId);
        return Ok(MapToResponse(user, settings));
    }

    [HttpPut("preferences")]
    public async Task<IActionResult> UpdatePreferences(UpdatePreferencesRequest request)
    {
        var userId = GetCurrentUserId();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        var settings = await GetOrCreateSettingsAsync(userId);

        settings.SpendingAlerts = request.Notifications.SpendingAlerts;
        settings.BudgetWarnings = request.Notifications.BudgetWarnings;
        settings.AiInsightsNotifications = request.Notifications.AiInsights;
        settings.WeeklyReport = request.Notifications.WeeklyReport;
        settings.UnusualActivity = request.Notifications.UnusualActivity;

        settings.AutoInsights = request.Ai.AutoInsights;
        settings.SpendingPredictions = request.Ai.SpendingPredictions;
        settings.AnomalyDetection = request.Ai.AnomalyDetection;
        settings.Personalisation = request.Ai.Personalisation;

        await _context.SaveChangesAsync();

        return Ok(MapToResponse(user, settings));
    }

    private async Task<UserSettings> GetOrCreateSettingsAsync(Guid userId)
    {
        var settings = await _context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings is null)
        {
            settings = new UserSettings { UserId = userId };
            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return settings;
    }

    private static SettingsResponse MapToResponse(User user, UserSettings settings) => new()
    {
        FullName = user.FullName,
        Email = user.Email,
        PhoneNumber = user.PhoneNumber,
        Notifications = new NotificationSettingsDto
        {
            SpendingAlerts = settings.SpendingAlerts,
            BudgetWarnings = settings.BudgetWarnings,
            AiInsights = settings.AiInsightsNotifications,
            WeeklyReport = settings.WeeklyReport,
            UnusualActivity = settings.UnusualActivity
        },
        Ai = new AiSettingsDto
        {
            AutoInsights = settings.AutoInsights,
            SpendingPredictions = settings.SpendingPredictions,
            AnomalyDetection = settings.AnomalyDetection,
            Personalisation = settings.Personalisation
        }
    };

    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }
}