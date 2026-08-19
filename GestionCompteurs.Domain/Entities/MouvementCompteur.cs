namespace GestionCompteurs.Domain.Entities;

public class MouvementCompteur
{
    public int Id { get; set; }
    public string NumCompteur { get; set; } = string.Empty;
    public DateOnly DateMouvement { get; set; }
    public string IndexValeur { get; set; } = string.Empty;
    public char Type { get; set; } // 'S' ou 'E'
    public string? Observation { get; set; }

    // Cle etrangere
    public int AbonnementId { get; set; }
    public Abonnement Abonnement { get; set; } = null!;
}