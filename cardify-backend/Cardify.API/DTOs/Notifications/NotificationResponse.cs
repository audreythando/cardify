namespace Cardify.Api.DTOs.Notifications;

public class NotificationResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class NotificationFeedResponse
{
    public List<NotificationResponse> Items { get; set; } = new();
    public int UnreadCount { get; set; }
}