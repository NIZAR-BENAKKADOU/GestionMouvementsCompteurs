using System.ComponentModel.DataAnnotations;

namespace GestionCompteurs.Application.DTOs;

/// <summary>
/// DTO enrichi pour l'affichage d'un abonné avec ses abonnements.
/// </summary>
public class AbonneDetailDto
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Cin { get; set; } = string.Empty;
    public string NomPrenom => $"{Prenom} {Nom}";

    public List<AbonnementDto> Abonnements { get; set; } = new();
}
