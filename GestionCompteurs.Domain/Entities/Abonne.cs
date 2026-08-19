namespace GestionCompteurs.Domain.Entities;

public class Abonne
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Cin { get; set; } = string.Empty;

    // Navigation
    public ICollection<Abonnement> Abonnements { get; set; } = new List<Abonnement>();
}