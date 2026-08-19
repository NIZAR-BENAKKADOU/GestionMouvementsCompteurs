using System.ComponentModel.DataAnnotations;

namespace GestionCompteurs.Application.DTOs;

public class MouvementCompteurDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Le numéro de compteur est obligatoire.")]
    [MaxLength(50)]
    public string NumCompteur { get; set; } = string.Empty;

    [Required]
    public DateOnly DateMouvement { get; set; }

    [Required(ErrorMessage = "L'index est obligatoire.")]
    [MaxLength(50)]
    public string IndexValeur { get; set; } = string.Empty;

    [Required]
    public char Type { get; set; } // 'S' = Sortie (Pose), 'E' = Entrée (Dépose)

    [MaxLength(255)]
    public string? Observation { get; set; }

    // Clé étrangère
    [Required]
    public int AbonnementId { get; set; }

    // Champ d'affichage — populé uniquement en lecture
    public string? AbonnementPolice { get; set; }
}
