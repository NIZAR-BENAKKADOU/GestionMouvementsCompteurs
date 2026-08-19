using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Services;

public class AbonneService : IAbonneService
{
    private readonly IAbonneRepository _repository;

    public AbonneService(IAbonneRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AbonneDto>> GetAllAsync()
    {
        var abonnes = await _repository.GetAllAsync();
        return abonnes.Select(ToDto).ToList();
    }

    public async Task<AbonneDetailDto?> GetByIdAsync(int id)
    {
        var abonne = await _repository.GetByIdAsync(id);
        return abonne is null ? null : ToDetailDto(abonne);
    }

    public async Task<List<AbonneDetailDto>> SearchAsync(
        string? police, string? secteur, string? numeroTournee,
        string? ordre, string? nomPrenom, string? cin)
    {
        var abonnes = await _repository.SearchAsync(police, secteur, numeroTournee, ordre, nomPrenom, cin);
        return abonnes.Select(ToDetailDto).ToList();
    }

    public async Task<AbonneDto> CreateAsync(AbonneDto dto)
    {
        var abonne = new Abonne
        {
            Nom    = dto.Nom,
            Prenom = dto.Prenom,
            Cin    = dto.Cin
        };
        var created = await _repository.AddAsync(abonne);
        return ToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, AbonneDto dto)
    {
        var abonne = await _repository.GetByIdAsync(id);
        if (abonne is null) return false;

        abonne.Nom    = dto.Nom;
        abonne.Prenom = dto.Prenom;
        abonne.Cin    = dto.Cin;

        return await _repository.UpdateAsync(abonne);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    // ── Méthodes de mapping ──────────────────────────────────────────────

    private static AbonneDto ToDto(Abonne a) => new()
    {
        Id     = a.Id,
        Nom    = a.Nom,
        Prenom = a.Prenom,
        Cin    = a.Cin
    };

    private static AbonneDetailDto ToDetailDto(Abonne a) => new()
    {
        Id     = a.Id,
        Nom    = a.Nom,
        Prenom = a.Prenom,
        Cin    = a.Cin,
        Abonnements = a.Abonnements.Select(ab => new AbonnementDto
        {
            Id              = ab.Id,
            Police          = ab.Police,
            Adresse         = ab.Adresse,
            AbonneId        = ab.AbonneId,
            AgenceId        = ab.AgenceId,
            AgenceNom       = ab.Agence?.Nom,
            TourneeId       = ab.TourneeId,
            TourneeCode     = ab.Tournee is null ? null
                              : $"{ab.Tournee.Localisation} | {ab.Tournee.Categorie} | {ab.Tournee.Secteur} | {ab.Tournee.NumeroTournee} | {ab.Tournee.Ordre}",
            AbonneNomPrenom = $"{a.Prenom} {a.Nom}"
        }).ToList()
    };
}
