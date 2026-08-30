using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EtudeController : ControllerBase
{
    private readonly IEtudeService _service;

    public EtudeController(IEtudeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<EtudeDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<EtudeDto>> GetById(int id)
    {
        var etude = await _service.GetByIdAsync(id);
        if (etude is null) return NotFound("Étude introuvable.");
        return Ok(etude);
    }

    [HttpPost]
    public async Task<ActionResult<EtudeDto>> Create(EtudeDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("UNIQUE") || msg.Contains("abonnement_id", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Un dossier d'étude est déjà rattaché à cet abonnement.");
            return BadRequest(msg);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, EtudeDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Étude introuvable.");
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("UNIQUE") || msg.Contains("abonnement_id", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Un dossier d'étude est déjà rattaché à cet abonnement.");
            return BadRequest(msg);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound("Étude introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.InnerException?.Message ?? ex.Message);
        }
    }
}
