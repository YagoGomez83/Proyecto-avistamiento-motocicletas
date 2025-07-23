namespace MotorcycleManager.Application.Motorcycles.Dtos;

using MotorcycleManager.Domain.Enums;

/// <summary>
/// Representa los datos de una Motocicleta que se envían al cliente.
/// Incluye el nombre de la marca para facilitar su visualización.
/// </summary>
public class MotorcycleDto
{
    public Guid Id { get; set; }
    public string? LicensePlate { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public EngineDisplacement? Displacement { get; set; }
    public string? Color { get; set; }

    // Datos de la relación con Brand
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
}