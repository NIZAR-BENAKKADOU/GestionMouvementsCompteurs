using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class AgenceRepository : IAgenceRepository
{
    private readonly ApplicationDbContext _context;

    public AgenceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Agence>> GetAllAsync()
        => await _context.Agences.ToListAsync();

    public async Task<Agence?> GetByIdAsync(int id)
        => await _context.Agences.FindAsync(id);

    public async Task<Agence> AddAsync(Agence agence)
    {
        _context.Agences.Add(agence);
        await _context.SaveChangesAsync();
        return agence;
    }

    public async Task<bool> UpdateAsync(Agence agence)
    {
        _context.Agences.Update(agence);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var agence = await GetByIdAsync(id);
        if (agence is null) return false;

        _context.Agences.Remove(agence);
        await _context.SaveChangesAsync();
        return true;
    }
}