using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface IAbonnementRepository
{
    Task<List<Abonnement>> GetAllAsync();
    Task<Abonnement?> GetByIdAsync(int id);
    Task<Abonnement> AddAsync(Abonnement abonnement);
    Task<bool> UpdateAsync(Abonnement abonnement);
    Task<bool> DeleteAsync(int id);
}
