using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Services;

public class AgenceService : IAgenceService
{
    private readonly IAgenceRepository _repository;

    public AgenceService(IAgenceRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AgenceDto>> GetAllAsync()
    {
        var agences = await _repository.GetAllAsync();
        return agences.Select(ToDto).ToList();
    }

    public async Task<AgenceDto?> GetByIdAsync(int id)
    {
        var agence = await _repository.GetByIdAsync(id);
        return agence is null ? null : ToDto(agence);
    }

    public async Task<AgenceDto> CreateAsync(AgenceDto dto)
    {
        var agence = new Agence { Nom = dto.Nom };
        var created = await _repository.AddAsync(agence);
        return ToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, AgenceDto dto)
    {
        var agence = await _repository.GetByIdAsync(id);
        if (agence is null) return false;

        agence.Nom = dto.Nom;
        return await _repository.UpdateAsync(agence);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    private static AgenceDto ToDto(Agence a) => new()
    {
        Id = a.Id,
        Nom = a.Nom
    };
}