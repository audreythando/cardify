using Cardify.Api.DTOs.Auth;
using Cardify.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);

        if (result is null)
        {
            return BadRequest("A user with this email already exists.");
        }

        return Ok(result);
    }
}