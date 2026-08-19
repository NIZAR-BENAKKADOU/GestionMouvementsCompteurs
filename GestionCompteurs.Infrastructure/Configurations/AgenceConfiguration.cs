using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestionCompteurs.Infrastructure.Configurations;

public class AgenceConfiguration : IEntityTypeConfiguration<Agence>
{
    public void Configure(EntityTypeBuilder<Agence> builder)
    {
        builder.ToTable("AGENCE");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");

        builder.Property(a => a.Nom)
            .HasColumnName("nom")
            .HasMaxLength(150)
            .IsRequired();
    }
}