using System.ComponentModel.DataAnnotations;
using Cardify.Api.Validation;

namespace Cardify.Api.DTOs.Budgets;

public class UpdateBudgetRequest
{
    [Required(ErrorMessage = "Category is required.")]
    [SpendingCategory]
    public string Category { get; set; } = string.Empty;

    [Range(typeof(decimal), "1", "1000000", ErrorMessage = "Monthly limit must be between R1 and R1,000,000.")]
    public decimal LimitAmount { get; set; }
}
