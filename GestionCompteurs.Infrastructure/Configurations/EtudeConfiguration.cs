using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GestionCompteurs.Infrastructure.Configurations;

public class EtudeConfiguration : IEntityTypeConfiguration<Etude>
{
    public void Configure(EntityTypeBuilder<Etude> builder)
    {
        builder.ToTable("ETUDE", t => t.UseSqlOutputClause(false));

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.CalibreDisjoncteur)
            .HasColumnName("calibre_disjoncteur")   // SQL : calibre_disjoncteur
            .HasMaxLength(50)
            .IsRequired();

        // Convertisseur personnalise pour correspondre aux valeurs SQL :
        // 'Nouvel Abonnement' et 'Ancienne Police' (avec espaces)
        var typePoliceConverter = new ValueConverter<TypePolice, string>(
            v => v == TypePolice.NouvelAbonnement ? "Nouvel Abonnement" : "Ancienne Police",
            v => v == "Nouvel Abonnement" ? TypePolice.NouvelAbonnement : TypePolice.AnciennePolice
        );

        builder.Property(e => e.TypePolice)
            .HasColumnName("type_police")
            .HasConversion(typePoliceConverter)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.NumeroTravail)
            .HasColumnName("numero_travail")
            .HasMaxLength(50);   // SQL : NVARCHAR(50)

        // FK columns
        builder.Property(e => e.AbonnementId).HasColumnName("abonnement_id");
        builder.Property(e => e.AnciennePoliceId).HasColumnName("ancienne_police_id");

        // Relation 1-1 obligatoire avec l'abonnement concerne (UNIQUE sur abonnement_id)
        builder.HasOne(e => e.Abonnement)
            .WithOne(a => a.Etude)
            .HasForeignKey<Etude>(e => e.AbonnementId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relation 1-1 optionnelle vers l'ancienne police
        builder.HasOne(e => e.AnciennePolice)
            .WithMany()
            .HasForeignKey(e => e.AnciennePoliceId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
    }
}
