using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Repositories;

public class AbonneRepository : IAbonneRepository
{
    private readonly ApplicationDbContext _context;

    public AbonneRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Abonne>> GetAllAsync()
        => await _context.Abonnes
            .Include(a => a.Abonnements)
                .ThenInclude(ab => ab.Agence)
            .Include(a => a.Abonnements)
                .ThenInclude(ab => ab.Tournee)
            .ToListAsync();

    public async Task<Abonne?> GetByIdAsync(int id)
        => await _context.Abonnes
            .Include(a => a.Abonnements)
                .ThenInclude(ab => ab.Agence)
            .Include(a => a.Abonnements)
                .ThenInclude(ab => ab.Tournee)
            .FirstOrDefaultAsync(a => a.Id == id);

    /// <summary>
    /// Recherche multicritères d'abonnés :
    /// par police, tournée (secteur | numéro | ordre), nom/prénom ou CIN.
    /// Tous les critères sont optionnels et cumulables (ET logique).
    /// </summary>
    public async Task<List<Abonne>> SearchAsync(
        string? police,
        string? secteur,
        string? numeroTournee,
        string? ordre,
        string? nomPrenom,
        string? cin)
    {
        var query = _context.Abonnes
            .Include(a => a.Abonnements)
                .ThenInclude(ab => ab.Agence)
            .Include(a => a.Abonnements)
                .ThenInclude(ab => ab.Tournee)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(cin))
            query = query.Where(a => a.Cin.Contains(cin));

        if (!string.IsNullOrWhiteSpace(nomPrenom))
        {
            var terme = nomPrenom.Trim();
            query = query.Where(a =>
                (a.Nom + " " + a.Prenom).Contains(terme) ||
                (a.Prenom + " " + a.Nom).Contains(terme));
        }

        if (!string.IsNullOrWhiteSpace(police))
            query = query.Where(a => a.Abonnements.Any(ab => ab.Police.Contains(police)));

        if (!string.IsNullOrWhiteSpace(secteur))
            query = query.Where(a => a.Abonnements.Any(ab => ab.Tournee.Secteur == secteur));

        if (!string.IsNullOrWhiteSpace(numeroTournee))
            query = query.Where(a => a.Abonnements.Any(ab => ab.Tournee.NumeroTournee == numeroTournee));

        if (!string.IsNullOrWhiteSpace(ordre))
            query = query.Where(a => a.Abonnements.Any(ab => ab.Tournee.Ordre == ordre));

        return await query.ToListAsync();
    }

    public async Task<Abonne> AddAsync(Abonne abonne)
    {
        _context.Abonnes.Add(abonne);
        await _context.SaveChangesAsync();
        return abonne;
    }

    public async Task<bool> UpdateAsync(Abonne abonne)
    {
        _context.Abonnes.Update(abonne);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var abonne = await _context.Abonnes.FindAsync(id);
        if (abonne is null) return false;

        _context.Abonnes.Remove(abonne);
        await _context.SaveChangesAsync();
        return true;
    }
}
