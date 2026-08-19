using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface IAbonneRepository
{
    Task<List<Abonne>> GetAllAsync();
    Task<Abonne?> GetByIdAsync(int id);
    Task<List<Abonne>> SearchAsync(string? police, string? secteur, string? numeroTournee, string? ordre, string? nomPrenom, string? cin);
    Task<Abonne> AddAsync(Abonne abonne);
    Task<bool> UpdateAsync(Abonne abonne);
    Task<bool> DeleteAsync(int id);
}
