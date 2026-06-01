using Cardify.Api.DTOs.Auth;
using Cardify.Api.Models;
using Cardify.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Cardify.Api.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
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
            Token = "JWT_TOKEN_COMING_NEXT"
        };
    }

    private static void CreatePasswordHash(string password, out string passwordHash, out string passwordSalt)
    {
        using var hmac = new HMACSHA512();

        passwordSalt = Convert.ToBase64String(hmac.Key);

        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        passwordHash = Convert.ToBase64String(hashBytes);
    }
}