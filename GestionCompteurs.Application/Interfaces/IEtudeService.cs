using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface IEtudeService
{
    Task<List<EtudeDto>> GetAllAsync();
    Task<EtudeDto?> GetByIdAsync(int id);
    Task<EtudeDto> CreateAsync(EtudeDto dto);
    Task<bool> UpdateAsync(int id, EtudeDto dto);
    Task<bool> DeleteAsync(int id);
}
