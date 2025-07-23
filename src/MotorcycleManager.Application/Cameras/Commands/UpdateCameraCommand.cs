using MediatR;
using MotorcycleManager.Application.Cameras.Dtos;

namespace MotorcycleManager.Application.Cameras.Commands;

/// <summary>
/// Comando para actualizar una cámara existente en el sistema.
/// </summary>
public class UpdateCameraCommand : IRequest<Unit>
{
    /// <summary>
    /// ID de la cámara a actualizar.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Nuevo nombre de la cámara (requerido).
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Nueva ubicación de la cámara (opcional).
    /// </summary>
    public AddressDto? Location { get; set; }
}
