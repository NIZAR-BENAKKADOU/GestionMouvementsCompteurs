using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);
        if (token == null)
            return Unauthorized("Login ou mot de passe incorrect.");

        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var success = await _authService.RegisterAsync(dto);
        if (!success)
            return BadRequest("L'enregistrement a échoué. Vérifiez si le login existe déjà ou si le rôle est invalide.");

        return Ok(new { Message = "Utilisateur créé avec succès." });
    }
}
