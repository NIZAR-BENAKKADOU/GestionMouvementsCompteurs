using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface IMouvementCompteurService
{
    Task<List<MouvementCompteurDto>> GetAllAsync();
    Task<MouvementCompteurDto?> GetByIdAsync(int id);
    Task<List<MouvementCompteurDto>> GetByAbonnementIdAsync(int abonnementId);
    Task<MouvementCompteurDto> CreateAsync(MouvementCompteurDto dto);
    Task<bool> UpdateAsync(int id, MouvementCompteurDto dto);
    Task<bool> DeleteAsync(int id);
}
