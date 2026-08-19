using GestionCompteurs.Domain.Enums;

namespace GestionCompteurs.Domain.Entities;

public class Utilisateur
{
    public int Id { get; set; }
    public string Login { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public RoleUtilisateur Role { get; set; }
}