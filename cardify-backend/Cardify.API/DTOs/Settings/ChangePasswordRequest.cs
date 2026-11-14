using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.DTOs.Settings;

public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Current password is required.")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required.")]
    [StringLength(128, MinimumLength = 6, ErrorMessage = "New password must be between 6 and 128 characters.")]
    public string NewPassword { get; set; } = string.Empty;
}
