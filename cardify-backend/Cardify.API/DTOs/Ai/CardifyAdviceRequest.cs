using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.DTOs.Ai;

public class CardifyAdviceRequest
{
    [Required(ErrorMessage = "Question is required.")]
    [StringLength(1000, ErrorMessage = "Question must be 1000 characters or fewer.")]
    public string Question { get; set; } = string.Empty;
}
