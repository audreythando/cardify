using Cardify.Api.DTOs.Auth;
using Cardify.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result is null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(result);
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin(GoogleLoginRequest request)
    {
        var result = await _authService.GoogleLoginAsync(request.Credential);

        if (result is null)
        {
            return Unauthorized("Google authentication failed.");
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var fullName = User.FindFirstValue(ClaimTypes.Name);
        var email = User.FindFirstValue(ClaimTypes.Email);

        return Ok(new
        {
            userId,
            fullName,
            email
        });
    }
}