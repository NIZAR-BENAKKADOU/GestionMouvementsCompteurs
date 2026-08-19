namespace GestionCompteurs.Domain.Entities;

public class Agence
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;

    // Navigation
    public ICollection<Abonnement> Abonnements { get; set; } = new List<Abonnement>();
}