namespace Cardify.Api.DTOs.Settings;

public class UpdatePreferencesRequest
{
    public NotificationSettingsDto Notifications { get; set; } = new();
    public AiSettingsDto Ai { get; set; } = new();
}