using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class AbonnementRepository : IAbonnementRepository
{
    private readonly ApplicationDbContext _context;

    public AbonnementRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Abonnement>> GetAllAsync()
        => await _context.Abonnements
            .Include(a => a.Abonne)
            .Include(a => a.Agence)
            .Include(a => a.Tournee)
            .ToListAsync();

    public async Task<Abonnement?> GetByIdAsync(int id)
        => await _context.Abonnements
            .Include(a => a.Abonne)
            .Include(a => a.Agence)
            .Include(a => a.Tournee)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<Abonnement> AddAsync(Abonnement abonnement)
    {
        _context.Abonnements.Add(abonnement);
        await _context.SaveChangesAsync();
        return abonnement;
    }

    public async Task<bool> UpdateAsync(Abonnement abonnement)
    {
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var abonnement = await _context.Abonnements.FindAsync(id);
        if (abonnement is null) return false;

        _context.Abonnements.Remove(abonnement);
        await _context.SaveChangesAsync();
        return true;
    }
}
