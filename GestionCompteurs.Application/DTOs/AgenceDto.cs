using System.ComponentModel.DataAnnotations;

namespace GestionCompteurs.Application.DTOs;

public class AgenceDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Le nom de l'agence est obligatoire.")]
    [MaxLength(100)]
    public string Nom { get; set; } = string.Empty;
}