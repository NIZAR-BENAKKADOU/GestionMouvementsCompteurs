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
        if (tournee is null) return NotFound();
        return Ok(tournee);
    }

    [HttpPost]
    public async Task<ActionResult<TourneeDto>> Create(TourneeDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TourneeDto dto)
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
