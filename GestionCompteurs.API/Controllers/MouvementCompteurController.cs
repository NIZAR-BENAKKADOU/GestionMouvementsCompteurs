using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MouvementCompteurController : ControllerBase
{
    private readonly IMouvementCompteurService _service;

    public MouvementCompteurController(IMouvementCompteurService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<MouvementCompteurDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<MouvementCompteurDto>> GetById(int id)
    {
        var mouvement = await _service.GetByIdAsync(id);
        if (mouvement is null) return NotFound("Mouvement introuvable.");
        return Ok(mouvement);
    }

    [HttpGet("by-abonnement/{abonnementId}")]
    public async Task<ActionResult<List<MouvementCompteurDto>>> GetByAbonnement(int abonnementId)
        => Ok(await _service.GetByAbonnementIdAsync(abonnementId));

    [HttpPost]
    public async Task<ActionResult<MouvementCompteurDto>> Create(MouvementCompteurDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, MouvementCompteurDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Mouvement introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound("Mouvement introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }
    }
}
