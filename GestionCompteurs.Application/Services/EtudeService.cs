using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Application.Validators;
using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Services;

public class EtudeService : IEtudeService
{
    private readonly IEtudeRepository _repository;
    private readonly EtudeValidator _validator;

    public EtudeService(IEtudeRepository repository, EtudeValidator validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<List<EtudeDto>> GetAllAsync()
    {
        var etudes = await _repository.GetAllAsync();
        return etudes.Select(ToDto).ToList();
    }

    public async Task<EtudeDto?> GetByIdAsync(int id)
    {
        var etude = await _repository.GetByIdAsync(id);
        return etude is null ? null : ToDto(etude);
    }

    public async Task<EtudeDto> CreateAsync(EtudeDto dto)
    {
        var validation = await _validator.ValidateAsync(dto);
        if (!validation.IsValid)
            throw new ArgumentException(validation.ErrorMessage);

        var etude = new Etude
        {
            CalibreDisjoncteur = dto.CalibreDisjoncteur,
            TypePolice = dto.TypePolice,
            NumeroTravail = dto.NumeroTravail,
            AbonnementId = dto.AbonnementId,
            AnciennePoliceId = dto.AnciennePoliceId
        };
        var created = await _repository.AddAsync(etude);
        return ToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, EtudeDto dto)
    {
        var etude = await _repository.GetByIdAsync(id);
        if (etude is null) return false;

        var validation = await _validator.ValidateAsync(dto);
        if (!validation.IsValid)
            throw new ArgumentException(validation.ErrorMessage);

        etude.CalibreDisjoncteur = dto.CalibreDisjoncteur;
        etude.TypePolice = dto.TypePolice;
        etude.NumeroTravail = dto.NumeroTravail;
        etude.AbonnementId = dto.AbonnementId;
        etude.AnciennePoliceId = dto.AnciennePoliceId;

        return await _repository.UpdateAsync(etude);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repository.DeleteAsync(id);

    private static EtudeDto ToDto(Etude e) => new()
    {
        Id = e.Id,
        CalibreDisjoncteur = e.CalibreDisjoncteur,
        TypePolice = e.TypePolice,
        NumeroTravail = e.NumeroTravail,
        AbonnementId = e.AbonnementId,
        AnciennePoliceId = e.AnciennePoliceId,
        AbonnementPolice = e.Abonnement?.Police,
        AnciennePoliceCode = e.AnciennePolice?.Police
    };
}
