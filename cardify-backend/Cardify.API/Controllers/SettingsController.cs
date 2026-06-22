using Cardify.Api.Data;
using Cardify.Api.DTOs.Settings;
using Cardify.Api.Models;
using Cardify.Api.Services;
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
    private readonly AuthService _authService;

    public SettingsController(ApplicationDbContext context, AuthService authService)
    {
        _context = context;
        _authService = authService;
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

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
        {
            return BadRequest(new { message = "New password must be at least 6 characters." });
        }

        var result = await _authService.ChangePasswordAsync(
            GetCurrentUserId(),
            request.CurrentPassword,
            request.NewPassword
        );

        return result switch
        {
            ChangePasswordResult.Success => Ok(new { message = "Password updated successfully." }),
            ChangePasswordResult.IncorrectPassword => BadRequest(new { message = "Your current password is incorrect." }),
            _ => NotFound()
        };
    }

    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar(UpdateAvatarRequest request)
    {
        var userId = GetCurrentUserId();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        if (request.AvatarUrl is not null && request.AvatarUrl.Length > 1_500_000)
        {
            return BadRequest(new { message = "Image is too large. Please use an image under 1MB." });
        }

        user.AvatarUrl = request.AvatarUrl;
        await _context.SaveChangesAsync();

        return Ok(new { avatarUrl = user.AvatarUrl });
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
        AvatarUrl = user.AvatarUrl,
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