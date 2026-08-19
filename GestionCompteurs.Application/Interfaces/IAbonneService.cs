using GestionCompteurs.Application.DTOs;

namespace GestionCompteurs.Application.Interfaces;

public interface IAbonneService
{
    Task<List<AbonneDto>> GetAllAsync();
    Task<AbonneDetailDto?> GetByIdAsync(int id);
    Task<List<AbonneDetailDto>> SearchAsync(string? police, string? secteur, string? numeroTournee, string? ordre, string? nomPrenom, string? cin);
    Task<AbonneDto> CreateAsync(AbonneDto dto);
    Task<bool> UpdateAsync(int id, AbonneDto dto);
    Task<bool> DeleteAsync(int id);
}
