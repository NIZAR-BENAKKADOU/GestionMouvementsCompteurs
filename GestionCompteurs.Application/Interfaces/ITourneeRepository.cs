using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface ITourneeRepository
{
    Task<List<Tournee>> GetAllAsync();
    Task<Tournee?> GetByIdAsync(int id);
    Task<Tournee> AddAsync(Tournee tournee);
    Task<bool> UpdateAsync(Tournee tournee);
    Task<bool> DeleteAsync(int id);
}
