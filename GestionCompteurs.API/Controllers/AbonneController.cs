using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AbonneController : ControllerBase
{
    private readonly IAbonneService _service;

    public AbonneController(IAbonneService service)
    {
        _service = service;
    }

    /// <summary>Retourne tous les abonnés (liste simple pour les dropdowns).</summary>
    [HttpGet]
    public async Task<ActionResult<List<AbonneDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    /// <summary>Retourne un abonné avec ses abonnements.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AbonneDetailDto>> GetById(int id)
    {
        var abonne = await _service.GetByIdAsync(id);
        if (abonne is null) return NotFound();
        return Ok(abonne);
    }

    /// <summary>
    /// Recherche multicritères : police, secteur, numéroTournée, ordre, nomPrenom, cin.
    /// Tous les paramètres sont optionnels. Si aucun n'est fourni, retourne tous les abonnés.
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<List<AbonneDetailDto>>> Search(
        [FromQuery] string? police,
        [FromQuery] string? secteur,
        [FromQuery] string? numeroTournee,
        [FromQuery] string? ordre,
        [FromQuery] string? nomPrenom,
        [FromQuery] string? cin)
    {
        var results = await _service.SearchAsync(police, secteur, numeroTournee, ordre, nomPrenom, cin);
        return Ok(results);
    }

    [HttpPost]
    public async Task<ActionResult<AbonneDto>> Create(AbonneDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AbonneDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
