namespace MotorcycleManager.Application.Sightings.Dtos;

/// <summary>
/// Representa los datos de un Avistamiento que se envían al cliente.
/// Es un DTO rico que aplana la información de las entidades relacionadas
/// para que el frontend no tenga que hacer múltiples peticiones.
/// </summary>
public class SightingDto
{
    public Guid Id { get; set; }
    public DateTime SightingTimeUtc { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Notes { get; set; }

    // Datos aplanados de la Cámara
    public Guid CameraId { get; set; }
    public string CameraName { get; set; } = string.Empty;

    // Datos aplanados de la Motocicleta
    public Guid MotorcycleId { get; set; }
    public string? MotorcycleLicensePlate { get; set; }
    public string? MotorcycleModel { get; set; }
    public string MotorcycleBrandName { get; set; } = string.Empty;
    public int? MotorcycleYear { get; set; }
    public string? MotorcycleColor { get; set; }
    public int? MotorcycleDisplacement { get; set; }
}