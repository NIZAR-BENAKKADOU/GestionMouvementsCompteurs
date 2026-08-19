using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface IAgenceRepository
{
    Task<List<Agence>> GetAllAsync();
    Task<Agence?> GetByIdAsync(int id);
    Task<Agence> AddAsync(Agence agence);
    Task<bool> UpdateAsync(Agence agence);
    Task<bool> DeleteAsync(int id);
}
