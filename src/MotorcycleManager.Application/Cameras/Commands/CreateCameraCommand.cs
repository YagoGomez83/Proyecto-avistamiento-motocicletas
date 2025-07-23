using MediatR;
using MotorcycleManager.Application.Cameras.Dtos;

namespace MotorcycleManager.Application.Cameras.Commands;

/// <summary>
/// Comando para crear una nueva cámara en el sistema.
/// </summary>
public class CreateCameraCommand : IRequest<Guid>
{
    /// <summary>
    /// Nombre de la cámara (requerido).
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Ubicación de la cámara (opcional).
    /// </summary>
    public AddressDto? Location { get; set; }
}
