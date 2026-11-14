using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.Validation;

/// <summary>
/// Spending categories shared by budgets and transactions. Keep in sync with
/// SPENDING_CATEGORIES in the frontend (src/utils/categories.ts).
/// </summary>
public static class SpendingCategories
{
    public static readonly IReadOnlyList<string> All = new[]
    {
        "Groceries",
        "Shopping",
        "Entertainment",
        "Transportation",
        "Healthcare",
        "Food & Dining",
        "Bills & Utilities",
        "Fuel",
        "Travel",
        "Other",
    };

    /// <summary>Returns the canonical spelling of a category, or null if it is not recognised.</summary>
    public static string? Normalize(string? category) =>
        All.FirstOrDefault(c => string.Equals(c, category?.Trim(), StringComparison.OrdinalIgnoreCase));
}

/// <summary>Validates that a string is one of <see cref="SpendingCategories.All"/> (case-insensitive).</summary>
[AttributeUsage(AttributeTargets.Property)]
public sealed class SpendingCategoryAttribute : ValidationAttribute
{
    public SpendingCategoryAttribute()
        : base($"Category must be one of: {string.Join(", ", SpendingCategories.All)}.")
    {
    }

    public override bool IsValid(object? value) =>
        value is null || SpendingCategories.Normalize(value as string) is not null;
}
