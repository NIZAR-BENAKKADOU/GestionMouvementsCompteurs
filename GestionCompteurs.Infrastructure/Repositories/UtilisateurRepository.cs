using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class UtilisateurRepository : IUtilisateurRepository
{
    private readonly ApplicationDbContext _context;

    public UtilisateurRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Utilisateur?> GetByLoginAsync(string login)
        => await _context.Utilisateurs
            .FirstOrDefaultAsync(u => u.Login == login);

    public async Task<Utilisateur> AddAsync(Utilisateur utilisateur)
    {
        _context.Utilisateurs.Add(utilisateur);
        await _context.SaveChangesAsync();
        return utilisateur;
    }
}
