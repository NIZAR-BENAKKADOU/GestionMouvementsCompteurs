using GestionCompteurs.Domain.Enums;

namespace GestionCompteurs.Domain.Entities;

public class Etude
{
    public int Id { get; set; }
    public string CalibreDisjoncteur { get; set; } = string.Empty;
    public TypePolice TypePolice { get; set; }
    public string? NumeroTravail { get; set; }

    // Relation 1-1 avec l'abonnement concerne par cette etude
    public int AbonnementId { get; set; }
    public Abonnement Abonnement { get; set; } = null!;

    // Relation 1-1 optionnelle vers l'ancien abonnement (si TypePolice = AnciennePolice)
    public int? AnciennePoliceId { get; set; }
    public Abonnement? AnciennePolice { get; set; }
}