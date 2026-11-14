using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.DTOs.Settings;

public class UpdateProfileRequest
{
    [Required(ErrorMessage = "Full name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 100 characters.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [StringLength(254, ErrorMessage = "Email is too long.")]
    public string Email { get; set; } = string.Empty;

    // Optional; digits with an optional leading +, spaces or hyphens.
    [RegularExpression(@"^\+?[0-9][0-9\s-]{7,18}[0-9]$", ErrorMessage = "Enter a valid phone number, e.g. +27 82 123 4567.")]
    public string? PhoneNumber { get; set; }
}
