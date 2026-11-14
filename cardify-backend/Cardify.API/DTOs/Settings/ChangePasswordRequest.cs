using System.ComponentModel.DataAnnotations;
using Cardify.Api.Validation;

namespace Cardify.Api.DTOs.Settings;

public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Current password is required.")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required.")]
    [StrongPassword]
    public string NewPassword { get; set; } = string.Empty;
}
