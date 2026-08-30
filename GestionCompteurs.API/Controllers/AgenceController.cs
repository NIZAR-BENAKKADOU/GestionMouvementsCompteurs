using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgenceController : ControllerBase
{
    private readonly IAgenceService _service;

    public AgenceController(IAgenceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<AgenceDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<AgenceDto>> GetById(int id)
    {
        var agence = await _service.GetByIdAsync(id);
        if (agence is null) return NotFound("Agence introuvable.");
        return Ok(agence);
    }

    [HttpPost]
    public async Task<ActionResult<AgenceDto>> Create(AgenceDto dto)
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
    public async Task<IActionResult> Update(int id, AgenceDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Agence introuvable.");
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
            if (!deleted) return NotFound("Agence introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("REFERENCE") || msg.Contains("FK_") || msg.Contains("constraint", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Impossible de supprimer cette agence car des abonnements ou tournées y sont rattachés.");
            return BadRequest(msg);
        }
    }
}