using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface IEtudeRepository
{
    Task<List<Etude>> GetAllAsync();
    Task<Etude?> GetByIdAsync(int id);
    Task<Etude> AddAsync(Etude etude);
    Task<bool> UpdateAsync(Etude etude);
    Task<bool> DeleteAsync(int id);
}
