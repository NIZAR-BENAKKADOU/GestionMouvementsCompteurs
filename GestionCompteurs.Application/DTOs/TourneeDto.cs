namespace GestionCompteurs.Application.DTOs;

public class TourneeDto
{
    public int Id { get; set; }
    public string Localisation { get; set; } = string.Empty;
    public string Categorie { get; set; } = string.Empty;
    public string Secteur { get; set; } = string.Empty;
    public string NumeroTournee { get; set; } = string.Empty;
    public string Ordre { get; set; } = string.Empty;
    public int AgenceId { get; set; }
    public string? AgenceNom { get; set; }
}
