namespace Cardify.Api.Models;

public class AiInsight
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string InsightType { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }

    public User? User { get; set; }
}