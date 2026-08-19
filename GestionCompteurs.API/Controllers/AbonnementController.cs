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
        if (abonnement is null) return NotFound();
        return Ok(abonnement);
    }

    [HttpPost]
    public async Task<ActionResult<AbonnementDto>> Create(AbonnementDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AbonnementDto dto)
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
