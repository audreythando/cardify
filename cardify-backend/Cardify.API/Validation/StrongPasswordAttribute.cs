using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Cardify.Api.Validation;

/// <summary>
/// Requires a password of 8-128 characters with at least one uppercase letter,
/// one number and one special character. Mirrors PASSWORD_RULES in the frontend
/// (src/utils/validation.ts).
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public sealed class StrongPasswordAttribute : ValidationAttribute
{
    public const int MinLength = 8;
    public const int MaxLength = 128;

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not string password || password.Length == 0)
        {
            return ValidationResult.Success; // [Required] reports missing values.
        }

        if (password.Length > MaxLength)
        {
            return new ValidationResult($"Password must be {MaxLength} characters or fewer.");
        }

        var missing = new List<string>();
        if (password.Length < MinLength) missing.Add($"at least {MinLength} characters");
        if (!Regex.IsMatch(password, "[A-Z]")) missing.Add("one uppercase letter");
        if (!Regex.IsMatch(password, "[0-9]")) missing.Add("one number");
        if (!Regex.IsMatch(password, @"[^A-Za-z0-9\s]")) missing.Add("one special character");

        return missing.Count == 0
            ? ValidationResult.Success
            : new ValidationResult($"Password needs {string.Join(", ", missing)}.");
    }
}
