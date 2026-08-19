using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestionCompteurs.Infrastructure.Configurations;

public class TourneeConfiguration : IEntityTypeConfiguration<Tournee>
{
    public void Configure(EntityTypeBuilder<Tournee> builder)
    {
        builder.ToTable("TOURNEE");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id");

        builder.Property(t => t.Localisation)
            .HasColumnName("localisation")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(t => t.Categorie)
            .HasColumnName("categorie")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(t => t.Secteur)
            .HasColumnName("secteur")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(t => t.NumeroTournee)
            .HasColumnName("numero_tournee")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(t => t.Ordre)
            .HasColumnName("ordre")
            .HasMaxLength(10)
            .IsRequired();
    }
}
