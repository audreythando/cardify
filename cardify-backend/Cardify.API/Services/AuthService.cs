using Cardify.Api.DTOs.Auth;
using Cardify.Api.Models;
using Cardify.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Google.Apis.Auth;

namespace Cardify.Api.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(user => user.Email == request.Email);

        if (existingUser is not null)
        {
            return null;
        }

        CreatePasswordHash(request.Password, out string passwordHash, out string passwordSalt);

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            Provider = "Local"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Token = CreateToken(user)
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Email == request.Email);

        if (user is null)
        {
            return null;
        }

        // OAuth users have no password — they must use their provider to sign in.
        if (string.IsNullOrEmpty(user.PasswordHash) || string.IsNullOrEmpty(user.PasswordSalt))
        {
            return null;
        }

        var isPasswordValid = VerifyPasswordHash(
            request.Password,
            user.PasswordHash,
            user.PasswordSalt
        );

        if (!isPasswordValid)
        {
            return null;
        }

        return new AuthResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Token = CreateToken(user)
        };
    }

public async Task<AuthResponse?> GoogleLoginAsync(string accessToken)
{
    GoogleUserInfo? googleUser;

    try
    {
        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var response = await httpClient.GetAsync(
            "https://www.googleapis.com/oauth2/v3/userinfo");

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();
        googleUser = System.Text.Json.JsonSerializer.Deserialize<GoogleUserInfo>(json);
    }
    catch
    {
        return null;
    }

    if (googleUser is null || string.IsNullOrEmpty(googleUser.Email))
    {
        return null;
    }

    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Email == googleUser.Email);

    if (user is null)
    {
        user = new User
        {
            FullName = googleUser.Name ?? googleUser.Email,
            Email = googleUser.Email,
            Provider = "Google",
            ProviderId = googleUser.Sub,
            AvatarUrl = googleUser.Picture
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    return new AuthResponse
    {
        UserId = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        AvatarUrl = user.AvatarUrl,
        Token = CreateToken(user)
    };
}

    public async Task<ChangePasswordResult> ChangePasswordAsync(
        Guid userId,
        string currentPassword,
        string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return ChangePasswordResult.UserNotFound;
        }

        // OAuth users have no password to change.
        if (string.IsNullOrEmpty(user.PasswordHash) || string.IsNullOrEmpty(user.PasswordSalt))
        {
            return ChangePasswordResult.IncorrectPassword;
        }

        var isCurrentValid = VerifyPasswordHash(
            currentPassword,
            user.PasswordHash,
            user.PasswordSalt
        );

        if (!isCurrentValid)
        {
            return ChangePasswordResult.IncorrectPassword;
        }

        CreatePasswordHash(newPassword, out string newHash, out string newSalt);

        user.PasswordHash = newHash;
        user.PasswordSalt = newSalt;

        await _context.SaveChangesAsync();

        return ChangePasswordResult.Success;
    }

    private static void CreatePasswordHash(string password, out string passwordHash, out string passwordSalt)
    {
        using var hmac = new HMACSHA512();

        passwordSalt = Convert.ToBase64String(hmac.Key);

        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        passwordHash = Convert.ToBase64String(hashBytes);
    }

    private static bool VerifyPasswordHash(
        string password,
        string storedHash,
        string storedSalt)
    {
        var saltBytes = Convert.FromBase64String(storedSalt);

        using var hmac = new HMACSHA512(saltBytes);

        var computedHash = hmac.ComputeHash(
            Encoding.UTF8.GetBytes(password)
        );

        var computedHashString = Convert.ToBase64String(computedHash);

        return computedHashString == storedHash;
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class GoogleUserInfo
{
    [System.Text.Json.Serialization.JsonPropertyName("sub")]
    public string Sub { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [System.Text.Json.Serialization.JsonPropertyName("name")]
    public string? Name { get; set; }

    [System.Text.Json.Serialization.JsonPropertyName("picture")]
    public string? Picture { get; set; }
}

public enum ChangePasswordResult
{
    Success,
    IncorrectPassword,
    UserNotFound
}