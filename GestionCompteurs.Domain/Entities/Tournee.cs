namespace GestionCompteurs.Domain.Entities;

public class Tournee
{
    public int Id { get; set; }
    public string Localisation { get; set; } = string.Empty;
    public string Categorie { get; set; } = string.Empty;
    public string Secteur { get; set; } = string.Empty;
    public string NumeroTournee { get; set; } = string.Empty;
    public string Ordre { get; set; } = string.Empty;

    // Navigation
    public ICollection<Abonnement> Abonnements { get; set; } = new List<Abonnement>();
}