using GestionCompteurs.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GestionCompteurs.Infrastructure.Configurations;

public class UtilisateurConfiguration : IEntityTypeConfiguration<Utilisateur>
{
    public void Configure(EntityTypeBuilder<Utilisateur> builder)
    {
        builder.ToTable("UTILISATEUR");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasColumnName("id");

        builder.Property(u => u.Login)
            .HasColumnName("login")
            .HasMaxLength(50)   // SQL : NVARCHAR(50)
            .IsRequired();

        builder.HasIndex(u => u.Login).IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(255)
            .IsRequired();

        // Les valeurs SQL CHECK : 'Consultation' et 'Administration'
        // correspondent exactement aux noms de l'enum C# -> HasConversion<string>() suffit
        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion<string>()
            .HasMaxLength(20)   // SQL : NVARCHAR(20)
            .IsRequired();
    }
}
