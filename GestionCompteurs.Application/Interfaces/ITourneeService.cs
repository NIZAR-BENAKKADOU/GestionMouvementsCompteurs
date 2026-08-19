using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface ITourneeService
{
    Task<List<TourneeDto>> GetAllAsync();
    Task<TourneeDto?> GetByIdAsync(int id);
    Task<TourneeDto> CreateAsync(TourneeDto dto);
    Task<bool> UpdateAsync(int id, TourneeDto dto);
    Task<bool> DeleteAsync(int id);
}
