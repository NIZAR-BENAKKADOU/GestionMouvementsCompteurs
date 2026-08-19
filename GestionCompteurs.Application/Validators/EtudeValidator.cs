using GestionCompteurs.Application.DTOs;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Enums;

namespace GestionCompteurs.Application.Validators;

public class EtudeValidator
{
    private readonly IAbonnementRepository _abonnementRepository;

    public EtudeValidator(IAbonnementRepository abonnementRepository)
    {
        _abonnementRepository = abonnementRepository;
    }

    public async Task<(bool IsValid, string ErrorMessage)> ValidateAsync(EtudeDto dto)
    {
        if (dto.TypePolice == TypePolice.AnciennePolice)
        {
            if (!dto.AnciennePoliceId.HasValue)
                return (false, "L'identifiant de l'ancienne police est requis pour le type 'Ancienne Police'.");

            if (dto.AbonnementId == dto.AnciennePoliceId.Value)
                return (false, "Un abonnement ne peut pas être sa propre ancienne police.");

            var nouvelAbo = await _abonnementRepository.GetByIdAsync(dto.AbonnementId);
            var ancienAbo = await _abonnementRepository.GetByIdAsync(dto.AnciennePoliceId.Value);

            if (nouvelAbo == null || ancienAbo == null)
                return (false, "L'abonnement ou l'ancienne police spécifié est introuvable.");

            if (nouvelAbo.Adresse != ancienAbo.Adresse || nouvelAbo.TourneeId != ancienAbo.TourneeId)
                return (false, "L'adresse et la tournée doivent correspondre entre l'abonnement et son ancienne police.");
        }
        else if (dto.TypePolice == TypePolice.NouvelAbonnement)
        {
            if (dto.AnciennePoliceId.HasValue)
                return (false, "Une ancienne police ne peut pas être définie pour un 'Nouvel Abonnement'.");
        }

        return (true, string.Empty);
    }
}
