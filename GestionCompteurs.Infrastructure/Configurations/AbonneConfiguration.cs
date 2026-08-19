using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestionCompteurs.Infrastructure.Configurations;

public class AbonneConfiguration : IEntityTypeConfiguration<Abonne>
{
    public void Configure(EntityTypeBuilder<Abonne> builder)
    {
        builder.ToTable("ABONNE");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");

        builder.Property(a => a.Nom)
            .HasColumnName("nom")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.Prenom)
            .HasColumnName("prenom")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.Cin)
            .HasColumnName("cin")
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(a => a.Cin).IsUnique();
    }
}
