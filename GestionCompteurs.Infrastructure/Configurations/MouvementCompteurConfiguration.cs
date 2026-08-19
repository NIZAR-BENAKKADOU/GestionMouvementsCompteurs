using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestionCompteurs.Infrastructure.Configurations;

public class MouvementCompteurConfiguration : IEntityTypeConfiguration<MouvementCompteur>
{
    public void Configure(EntityTypeBuilder<MouvementCompteur> builder)
    {
        builder.ToTable("MOUVEMENT_COMPTEUR");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");

        builder.Property(m => m.NumCompteur)
            .HasColumnName("num_compteur")
            .HasMaxLength(50)   // SQL : NVARCHAR(50)
            .IsRequired();

        builder.Property(m => m.DateMouvement)
            .HasColumnName("date_mouvement")
            .IsRequired();

        builder.Property(m => m.IndexValeur)
            .HasColumnName("index_valeur")
            .HasMaxLength(50)   // SQL : NVARCHAR(50)
            .IsRequired();

        builder.Property(m => m.Type)
            .HasColumnName("type")
            .HasMaxLength(1)    // SQL : CHAR(1) — valeurs : 'S' ou 'E'
            .IsRequired();

        builder.Property(m => m.Observation)
            .HasColumnName("observation")
            .HasMaxLength(255);

        // FK column
        builder.Property(m => m.AbonnementId).HasColumnName("abonnement_id");

        // Relation avec Abonnement (N,1)
        builder.HasOne(m => m.Abonnement)
            .WithMany(a => a.MouvementsCompteur)
            .HasForeignKey(m => m.AbonnementId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
