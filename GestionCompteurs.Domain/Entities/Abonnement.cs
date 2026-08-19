namespace GestionCompteurs.Domain.Entities;

public class Abonnement
{
    public int Id { get; set; }
    public string Police { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;

    // Cles etrangeres
    public int AbonneId { get; set; }
    public int AgenceId { get; set; }
    public int TourneeId { get; set; }

    // Navigation
    public Abonne Abonne { get; set; } = null!;
    public Agence Agence { get; set; } = null!;
    public Tournee Tournee { get; set; } = null!;
    public Etude? Etude { get; set; }
    public ICollection<MouvementCompteur> MouvementsCompteur { get; set; } = new List<MouvementCompteur>();
}