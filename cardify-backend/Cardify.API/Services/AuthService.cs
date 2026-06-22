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
            PasswordSalt = passwordSalt
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

public enum ChangePasswordResult
{
    Success,
    IncorrectPassword,
    UserNotFound
}