using GestionCompteurs.Domain.Entities;

namespace GestionCompteurs.Application.Interfaces;

public interface IUtilisateurRepository
{
    Task<Utilisateur?> GetByLoginAsync(string login);
    Task<Utilisateur> AddAsync(Utilisateur utilisateur);
}
