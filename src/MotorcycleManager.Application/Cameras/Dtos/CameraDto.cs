using MotorcycleManager.Application.Cameras.Dtos;

namespace MotorcycleManager.Application.Cameras.Dtos;

/// <summary>
/// Representa los datos de una Cámara que se envían al cliente.
/// </summary>
public class CameraDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public AddressDto? Location { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}