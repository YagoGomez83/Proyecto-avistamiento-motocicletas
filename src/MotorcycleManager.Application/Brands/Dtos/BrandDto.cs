// --- DTOs para la entidad Brand ---

namespace MotorcycleManager.Application.Brands.Dtos;

/// <summary>
/// Representa los datos de una Marca que se envían al cliente.
/// </summary>
public class BrandDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}
