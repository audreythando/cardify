using System.ComponentModel.DataAnnotations;

namespace Cardify.Api.DTOs.Auth;

public class GoogleLoginRequest
{
    [Required(ErrorMessage = "Google credential is required.")]
    public string Credential { get; set; } = string.Empty;
}
