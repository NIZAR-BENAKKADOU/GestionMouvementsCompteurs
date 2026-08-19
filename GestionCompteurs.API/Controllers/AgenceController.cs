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
        if (agence is null) return NotFound();
        return Ok(agence);
    }

    [HttpPost]
    public async Task<ActionResult<AgenceDto>> Create(AgenceDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AgenceDto dto)
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