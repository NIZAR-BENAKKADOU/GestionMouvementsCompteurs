using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface IAbonnementService
{
    Task<List<AbonnementDto>> GetAllAsync();
    Task<AbonnementDto?> GetByIdAsync(int id);
    Task<AbonnementDto> CreateAsync(AbonnementDto dto);
    Task<bool> UpdateAsync(int id, AbonnementDto dto);
    Task<bool> DeleteAsync(int id);
}
