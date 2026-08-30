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
        if (abonne is null) return NotFound("Abonné introuvable.");
        return Ok(abonne);
    }

    /// <summary>
    /// Recherche multicritères : police, secteur, numéroTournée, ordre, nomPrenom, cin.
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
        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("UNIQUE") || msg.Contains("cin") || msg.Contains("duplicate", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Ce numéro de CIN est déjà utilisé par un autre abonné.");
            return BadRequest(msg);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AbonneDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Abonné introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("UNIQUE") || msg.Contains("cin") || msg.Contains("duplicate", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Ce numéro de CIN est déjà utilisé par un autre abonné.");
            return BadRequest(msg);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound("Abonné introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("REFERENCE") || msg.Contains("FK_") || msg.Contains("constraint", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Impossible de supprimer cet abonné car des abonnements y sont rattachés.");
            return BadRequest(msg);
        }
    }
}
