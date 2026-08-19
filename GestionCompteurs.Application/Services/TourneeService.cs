using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Services;

public class TourneeService : ITourneeService
{
    private readonly ITourneeRepository _repository;

    public TourneeService(ITourneeRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<TourneeDto>> GetAllAsync()
    {
        var tournees = await _repository.GetAllAsync();
        return tournees.Select(ToDto).ToList();
    }

    public async Task<TourneeDto?> GetByIdAsync(int id)
    {
        var tournee = await _repository.GetByIdAsync(id);
        return tournee is null ? null : ToDto(tournee);
    }

    public async Task<TourneeDto> CreateAsync(TourneeDto dto)
    {
        var tournee = new Tournee
        {
            Localisation = dto.Localisation,
            Categorie = dto.Categorie,
            Secteur = dto.Secteur,
            NumeroTournee = dto.NumeroTournee,
            Ordre = dto.Ordre
        };
        var created = await _repository.AddAsync(tournee);
        return ToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, TourneeDto dto)
    {
        var tournee = await _repository.GetByIdAsync(id);
        if (tournee is null) return false;

        tournee.Localisation = dto.Localisation;
        tournee.Categorie = dto.Categorie;
        tournee.Secteur = dto.Secteur;
        tournee.NumeroTournee = dto.NumeroTournee;
        tournee.Ordre = dto.Ordre;

        return await _repository.UpdateAsync(tournee);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    private static TourneeDto ToDto(Tournee t) => new()
    {
        Id = t.Id,
        Localisation = t.Localisation,
        Categorie = t.Categorie,
        Secteur = t.Secteur,
        NumeroTournee = t.NumeroTournee,
        Ordre = t.Ordre
    };
}
