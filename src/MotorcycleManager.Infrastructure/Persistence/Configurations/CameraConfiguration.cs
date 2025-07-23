using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MotorcycleManager.Domain.Entities;

namespace MotorcycleManager.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuración de Entity Framework para la entidad Camera.
/// </summary>
public class CameraConfiguration : IEntityTypeConfiguration<Camera>
{
    public void Configure(EntityTypeBuilder<Camera> builder)
    {
        // Configuración de la tabla
        builder.ToTable("Cameras");

        // Clave primaria
        builder.HasKey(c => c.Id);

        // Configuración de propiedades
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        // Configuración de la propiedad Location como Owned Entity
        builder.OwnsOne(c => c.Location, location =>
        {
            location.Property(a => a.Street)
                .HasColumnName("LocationStreet")
                .HasMaxLength(500);

            location.Property(a => a.City)
                .HasColumnName("LocationCity")
                .HasMaxLength(100);
        });

        // Configuración de propiedades de auditoría heredadas de AuditableEntity
        builder.Property(c => c.CreatedAtUtc)
            .IsRequired();

        builder.Property(c => c.LastModifiedAtUtc);

        // Configuración de relaciones
        builder.HasMany(c => c.Sightings)
            .WithOne(s => s.Camera)
            .HasForeignKey(s => s.CameraId)
            .OnDelete(DeleteBehavior.Cascade);

        // Índices
        builder.HasIndex(c => c.Name)
            .HasDatabaseName("IX_Cameras_Name");
    }
}
