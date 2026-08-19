using System.ComponentModel.DataAnnotations;
using GestionCompteurs.Domain.Enums;

namespace GestionCompteurs.Application.DTOs;

public class EtudeDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Le calibre du disjoncteur est obligatoire.")]
    [MaxLength(50)]
    public string CalibreDisjoncteur { get; set; } = string.Empty;

    [Required]
    public TypePolice TypePolice { get; set; }

    [MaxLength(50)]
    public string? NumeroTravail { get; set; }

    // Clés étrangères
    [Required]
    public int AbonnementId { get; set; }

    public int? AnciennePoliceId { get; set; }

    // Champs d'affichage — populés uniquement en lecture
    public string? AbonnementPolice { get; set; }
    public string? AnciennePoliceCode { get; set; }
}
