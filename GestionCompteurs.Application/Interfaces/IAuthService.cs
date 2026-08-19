using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface IAuthService
{
    Task<string?> LoginAsync(LoginDto dto);
    Task<bool> RegisterAsync(RegisterDto dto);
}
