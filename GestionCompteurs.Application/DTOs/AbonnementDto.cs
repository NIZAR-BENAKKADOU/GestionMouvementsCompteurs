using System.ComponentModel.DataAnnotations;

namespace GestionCompteurs.Application.DTOs;

public class AbonnementDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "La police est obligatoire.")]
    [MaxLength(50)]
    public string Police { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'adresse est obligatoire.")]
    [MaxLength(255)]
    public string Adresse { get; set; } = string.Empty;

    // Clés étrangères (requises pour create/update)
    [Required]
    public int AbonneId { get; set; }

    [Required]
    public int AgenceId { get; set; }

    [Required]
    public int TourneeId { get; set; }

    // Champs d'affichage — populés uniquement en lecture (null en create/update)
    public string? AbonneNomPrenom { get; set; }
    public string? AgenceNom { get; set; }
    public string? TourneeCode { get; set; } // Format : "Localisation | Catégorie | Secteur | Tournée | Ordre"
}
