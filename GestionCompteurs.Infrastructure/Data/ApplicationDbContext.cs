using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GestionCompteurs.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Abonne> Abonnes => Set<Abonne>();
    public DbSet<Abonnement> Abonnements => Set<Abonnement>();
    public DbSet<Etude> Etudes => Set<Etude>();
    public DbSet<Agence> Agences => Set<Agence>();
    public DbSet<Tournee> Tournees => Set<Tournee>();
    public DbSet<MouvementCompteur> MouvementsCompteur => Set<MouvementCompteur>();
    public DbSet<Utilisateur> Utilisateurs => Set<Utilisateur>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Applique automatiquement toutes les configurations
        // présentes dans le dossier Configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}