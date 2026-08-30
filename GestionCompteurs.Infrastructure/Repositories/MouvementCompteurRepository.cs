using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class MouvementCompteurRepository : IMouvementCompteurRepository
{
    private readonly ApplicationDbContext _context;

    public MouvementCompteurRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MouvementCompteur>> GetAllAsync()
        => await _context.MouvementsCompteur
            .Include(m => m.Abonnement)
            .ToListAsync();

    public async Task<MouvementCompteur?> GetByIdAsync(int id)
        => await _context.MouvementsCompteur
            .Include(m => m.Abonnement)
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task<List<MouvementCompteur>> GetByAbonnementIdAsync(int abonnementId)
        => await _context.MouvementsCompteur
            .Where(m => m.AbonnementId == abonnementId)
            .OrderByDescending(m => m.DateMouvement)
            .ToListAsync();

    public async Task<MouvementCompteur> AddAsync(MouvementCompteur mouvement)
    {
        _context.MouvementsCompteur.Add(mouvement);
        await _context.SaveChangesAsync();
        return mouvement;
    }

    public async Task<bool> UpdateAsync(MouvementCompteur mouvement)
    {
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var mouvement = await _context.MouvementsCompteur.FindAsync(id);
        if (mouvement is null) return false;

        _context.MouvementsCompteur.Remove(mouvement);
        await _context.SaveChangesAsync();
        return true;
    }
}
