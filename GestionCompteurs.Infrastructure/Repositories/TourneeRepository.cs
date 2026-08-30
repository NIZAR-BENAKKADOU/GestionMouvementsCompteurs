using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class TourneeRepository : ITourneeRepository
{
    private readonly ApplicationDbContext _context;

    public TourneeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tournee>> GetAllAsync()
        => await _context.Tournees.Include(t => t.Agence).ToListAsync();

    public async Task<Tournee?> GetByIdAsync(int id)
        => await _context.Tournees.Include(t => t.Agence).FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Tournee> AddAsync(Tournee tournee)
    {
        _context.Tournees.Add(tournee);
        await _context.SaveChangesAsync();
        return tournee;
    }

    public async Task<bool> UpdateAsync(Tournee tournee)
    {
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tournee = await GetByIdAsync(id);
        if (tournee is null) return false;

        _context.Tournees.Remove(tournee);
        await _context.SaveChangesAsync();
        return true;
    }
}
