using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AbonnementController : ControllerBase
{
    private readonly IAbonnementService _service;

    public AbonnementController(IAbonnementService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<AbonnementDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<AbonnementDto>> GetById(int id)
    {
        var abonnement = await _service.GetByIdAsync(id);
        if (abonnement is null) return NotFound("Abonnement introuvable.");
        return Ok(abonnement);
    }

    [HttpPost]
    public async Task<ActionResult<AbonnementDto>> Create(AbonnementDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("UNIQUE") || msg.Contains("police", StringComparison.OrdinalIgnoreCase) || msg.Contains("duplicate", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Ce numéro de police existe déjà dans le système.");
            return BadRequest(msg);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AbonnementDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Abonnement introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("UNIQUE") || msg.Contains("police", StringComparison.OrdinalIgnoreCase) || msg.Contains("duplicate", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Ce numéro de police existe déjà dans le système.");
            return BadRequest(msg);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound("Abonnement introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("REFERENCE") || msg.Contains("FK_") || msg.Contains("constraint", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Impossible de supprimer cet abonnement car des études ou mouvements de compteurs y sont associés.");
            return BadRequest(msg);
        }
    }
}
