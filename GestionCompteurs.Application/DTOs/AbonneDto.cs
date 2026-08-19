using System.ComponentModel.DataAnnotations;

namespace GestionCompteurs.Application.DTOs;

public class AbonneDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Le nom est obligatoire.")]
    [MaxLength(100)]
    public string Nom { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le prénom est obligatoire.")]
    [MaxLength(100)]
    public string Prenom { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le CIN est obligatoire.")]
    [MaxLength(20)]
    public string Cin { get; set; } = string.Empty;
}
