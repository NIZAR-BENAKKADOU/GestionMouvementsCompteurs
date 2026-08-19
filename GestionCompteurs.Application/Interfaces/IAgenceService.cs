using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface IAgenceService
{
    Task<List<AgenceDto>> GetAllAsync();
    Task<AgenceDto?> GetByIdAsync(int id);
    Task<AgenceDto> CreateAsync(AgenceDto dto);
    Task<bool> UpdateAsync(int id, AgenceDto dto);
    Task<bool> DeleteAsync(int id);
}
