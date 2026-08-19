using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface IMouvementCompteurRepository
{
    Task<List<MouvementCompteur>> GetAllAsync();
    Task<MouvementCompteur?> GetByIdAsync(int id);
    Task<List<MouvementCompteur>> GetByAbonnementIdAsync(int abonnementId);
    Task<MouvementCompteur> AddAsync(MouvementCompteur mouvement);
    Task<bool> UpdateAsync(MouvementCompteur mouvement);
    Task<bool> DeleteAsync(int id);
}
