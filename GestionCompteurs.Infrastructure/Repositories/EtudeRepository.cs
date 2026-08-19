using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class EtudeRepository : IEtudeRepository
{
    private readonly ApplicationDbContext _context;

    public EtudeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Etude>> GetAllAsync()
        => await _context.Etudes
            .Include(e => e.Abonnement)
            .Include(e => e.AnciennePolice)
            .ToListAsync();

    public async Task<Etude?> GetByIdAsync(int id)
        => await _context.Etudes
            .Include(e => e.Abonnement)
            .Include(e => e.AnciennePolice)
            .FirstOrDefaultAsync(e => e.Id == id);

    public async Task<Etude> AddAsync(Etude etude)
    {
        _context.Etudes.Add(etude);
        await _context.SaveChangesAsync();
        return etude;
    }

    public async Task<bool> UpdateAsync(Etude etude)
    {
        _context.Etudes.Update(etude);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var etude = await _context.Etudes.FindAsync(id);
        if (etude is null) return false;

        _context.Etudes.Remove(etude);
        await _context.SaveChangesAsync();
        return true;
    }
}
