using MediatR;

namespace MotorcycleManager.Application.Cameras.Commands;

/// <summary>
/// Comando para eliminar lógicamente una cámara del sistema.
/// </summary>
public class DeleteCameraCommand : IRequest<Unit>
{
    /// <summary>
    /// ID de la cámara a eliminar.
    /// </summary>
    public Guid Id { get; set; }

    public DeleteCameraCommand(Guid id)
    {
        Id = id;
    }
}
