using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GestionCompteurs.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUtilisateurRepository _repository;
    private readonly IConfiguration _configuration;

    public AuthService(IUtilisateurRepository repository, IConfiguration configuration)
    {
        _repository = repository;
        _configuration = configuration;
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = await _repository.GetByLoginAsync(dto.Login);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return null;
        }

        return GenerateJwtToken(user);
    }

    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
        if (await _repository.GetByLoginAsync(dto.Login) != null)
            return false;

        if (!Enum.TryParse<RoleUtilisateur>(dto.Role, true, out var role))
            return false;

        var user = new Utilisateur
        {
            Login = dto.Login,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = role
        };

        await _repository.AddAsync(user);
        return true;
    }

    private string GenerateJwtToken(Utilisateur user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is missing"));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["DurationInMinutes"] ?? "60")),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
