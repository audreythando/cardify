namespace Cardify.Api.Models;

public class UserSettings
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User? User { get; set; }

    // Notifications
    public bool SpendingAlerts { get; set; } = true;
    public bool BudgetWarnings { get; set; } = true;
    public bool AiInsightsNotifications { get; set; } = true;
    public bool WeeklyReport { get; set; } = false;
    public bool UnusualActivity { get; set; } = true;

    // AI assistant
    public bool AutoInsights { get; set; } = true;
    public bool SpendingPredictions { get; set; } = true;
    public bool AnomalyDetection { get; set; } = true;
    public bool Personalisation { get; set; } = true;
}