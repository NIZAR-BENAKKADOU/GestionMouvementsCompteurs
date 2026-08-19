using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestionCompteurs.Infrastructure.Configurations;

public class AbonnementConfiguration : IEntityTypeConfiguration<Abonnement>
{
    public void Configure(EntityTypeBuilder<Abonnement> builder)
    {
        builder.ToTable("ABONNEMENT");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");

        builder.Property(a => a.Police)
            .HasColumnName("police")
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(a => a.Police).IsUnique();

        builder.Property(a => a.Adresse)
            .HasColumnName("adresse")
            .HasMaxLength(255)
            .IsRequired();

        // FK columns
        builder.Property(a => a.AbonneId).HasColumnName("abonne_id");
        builder.Property(a => a.AgenceId).HasColumnName("agence_id");
        builder.Property(a => a.TourneeId).HasColumnName("tournee_id");

        // Relation avec Abonne (N,1)
        builder.HasOne(a => a.Abonne)
            .WithMany(ab => ab.Abonnements)
            .HasForeignKey(a => a.AbonneId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relation avec Agence (N,1)
        builder.HasOne(a => a.Agence)
            .WithMany(ag => ag.Abonnements)
            .HasForeignKey(a => a.AgenceId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relation avec Tournee (N,1)
        builder.HasOne(a => a.Tournee)
            .WithMany(t => t.Abonnements)
            .HasForeignKey(a => a.TourneeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}