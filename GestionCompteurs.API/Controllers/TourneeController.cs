using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestionCompteurs.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TourneeController : ControllerBase
{
    private readonly ITourneeService _service;

    public TourneeController(ITourneeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<TourneeDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<TourneeDto>> GetById(int id)
    {
        var tournee = await _service.GetByIdAsync(id);
        if (tournee is null) return NotFound("Tournée introuvable.");
        return Ok(tournee);
    }

    [HttpPost]
    public async Task<ActionResult<TourneeDto>> Create(TourneeDto dto)
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
    public async Task<IActionResult> Update(int id, TourneeDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Tournée introuvable.");
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
            if (!deleted) return NotFound("Tournée introuvable.");
            return NoContent();
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            if (msg.Contains("REFERENCE") || msg.Contains("FK_") || msg.Contains("constraint", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Impossible de supprimer cette tournée car des abonnements y sont rattachés.");
            return BadRequest(msg);
        }
    }
}
