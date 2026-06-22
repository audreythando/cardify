namespace Cardify.Api.DTOs.Settings;

public class SettingsResponse
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string? AvatarUrl { get; set; }
    public string? PhoneNumber { get; set; }

    public NotificationSettingsDto Notifications { get; set; } = new();
    public AiSettingsDto Ai { get; set; } = new();
}

public class NotificationSettingsDto
{
    public bool SpendingAlerts { get; set; }
    public bool BudgetWarnings { get; set; }
    public bool AiInsights { get; set; }
    public bool WeeklyReport { get; set; }
    public bool UnusualActivity { get; set; }
}

public class AiSettingsDto
{
    public bool AutoInsights { get; set; }
    public bool SpendingPredictions { get; set; }
    public bool AnomalyDetection { get; set; }
    public bool Personalisation { get; set; }
}