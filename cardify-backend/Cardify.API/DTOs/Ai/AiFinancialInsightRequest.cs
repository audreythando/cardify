using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.DTOs.Ai;

public class AiFinancialInsightRequest
{
    [Required(ErrorMessage = "Prompt is required.")]
    [StringLength(1000, ErrorMessage = "Prompt must be 1000 characters or fewer.")]
    public string Prompt { get; set; } = string.Empty;
}
