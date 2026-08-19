using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Services;

public class AbonnementService : IAbonnementService
{
    private readonly IAbonnementRepository _repository;

    public AbonnementService(IAbonnementRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AbonnementDto>> GetAllAsync()
    {
        var abonnements = await _repository.GetAllAsync();
        return abonnements.Select(ToDto).ToList();
    }

    public async Task<AbonnementDto?> GetByIdAsync(int id)
    {
        var abonnement = await _repository.GetByIdAsync(id);
        return abonnement is null ? null : ToDto(abonnement);
    }

    public async Task<AbonnementDto> CreateAsync(AbonnementDto dto)
    {
        var abonnement = new Abonnement
        {
            Police     = dto.Police,
            Adresse    = dto.Adresse,
            AbonneId   = dto.AbonneId,
            AgenceId   = dto.AgenceId,
            TourneeId  = dto.TourneeId
        };
        var created = await _repository.AddAsync(abonnement);
        // Recharger avec les includes pour renvoyer les données d'affichage
        var withDetails = await _repository.GetByIdAsync(created.Id);
        return withDetails is null ? ToDto(created) : ToDto(withDetails);
    }

    public async Task<bool> UpdateAsync(int id, AbonnementDto dto)
    {
        var abonnement = await _repository.GetByIdAsync(id);
        if (abonnement is null) return false;

        abonnement.Police    = dto.Police;
        abonnement.Adresse   = dto.Adresse;
        abonnement.AbonneId  = dto.AbonneId;
        abonnement.AgenceId  = dto.AgenceId;
        abonnement.TourneeId = dto.TourneeId;

        return await _repository.UpdateAsync(abonnement);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    /// <summary>
    /// Mappe un Abonnement vers son DTO en incluant les champs d'affichage
    /// (nom abonné, nom agence, code tournée formaté).
    /// </summary>
    private static AbonnementDto ToDto(Abonnement a) => new()
    {
        Id              = a.Id,
        Police          = a.Police,
        Adresse         = a.Adresse,
        AbonneId        = a.AbonneId,
        AbonneNomPrenom = a.Abonne is null ? null : $"{a.Abonne.Prenom} {a.Abonne.Nom}",
        AgenceId        = a.AgenceId,
        AgenceNom       = a.Agence?.Nom,
        TourneeId       = a.TourneeId,
        TourneeCode     = a.Tournee is null ? null
                          : $"{a.Tournee.Localisation} | {a.Tournee.Categorie} | {a.Tournee.Secteur} | {a.Tournee.NumeroTournee} | {a.Tournee.Ordre}"
    };
}
