using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Services;

public class MouvementCompteurService : IMouvementCompteurService
{
    private readonly IMouvementCompteurRepository _repository;

    public MouvementCompteurService(IMouvementCompteurRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<MouvementCompteurDto>> GetAllAsync()
    {
        var mouvements = await _repository.GetAllAsync();
        return mouvements.Select(ToDto).ToList();
    }

    public async Task<MouvementCompteurDto?> GetByIdAsync(int id)
    {
        var mouvement = await _repository.GetByIdAsync(id);
        return mouvement is null ? null : ToDto(mouvement);
    }

    public async Task<List<MouvementCompteurDto>> GetByAbonnementIdAsync(int abonnementId)
    {
        var mouvements = await _repository.GetByAbonnementIdAsync(abonnementId);
        return mouvements.Select(ToDto).ToList();
    }

    public async Task<MouvementCompteurDto> CreateAsync(MouvementCompteurDto dto)
    {
        var mouvement = new MouvementCompteur
        {
            NumCompteur   = dto.NumCompteur,
            DateMouvement = dto.DateMouvement,
            IndexValeur   = dto.IndexValeur,
            Type          = dto.Type,
            Observation   = dto.Observation,
            AbonnementId  = dto.AbonnementId
        };
        var created = await _repository.AddAsync(mouvement);
        return ToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, MouvementCompteurDto dto)
    {
        var mouvement = await _repository.GetByIdAsync(id);
        if (mouvement is null) return false;

        mouvement.NumCompteur   = dto.NumCompteur;
        mouvement.DateMouvement = dto.DateMouvement;
        mouvement.IndexValeur   = dto.IndexValeur;
        mouvement.Type          = dto.Type;
        mouvement.Observation   = dto.Observation;
        mouvement.AbonnementId  = dto.AbonnementId;

        return await _repository.UpdateAsync(mouvement);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    private static MouvementCompteurDto ToDto(MouvementCompteur m) => new()
    {
        Id                 = m.Id,
        NumCompteur        = m.NumCompteur,
        DateMouvement      = m.DateMouvement,
        IndexValeur        = m.IndexValeur,
        Type               = m.Type,
        Observation        = m.Observation,
        AbonnementId       = m.AbonnementId,
        AbonnementPolice   = m.Abonnement?.Police
    };
}
