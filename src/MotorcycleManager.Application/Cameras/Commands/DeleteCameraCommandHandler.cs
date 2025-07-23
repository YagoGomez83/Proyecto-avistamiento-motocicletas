using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Cameras.Commands;

/// <summary>
/// Handler para procesar el comando de eliminación lógica de una cámara.
/// </summary>
public class DeleteCameraCommandHandler : IRequestHandler<DeleteCameraCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteCameraCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteCameraCommand request, CancellationToken cancellationToken)
    {
        // Buscar la cámara existente que no esté eliminada
        var camera = await _context.Cameras
            .FirstOrDefaultAsync(c => c.Id == request.Id && !c.IsDeleted, cancellationToken);

        if (camera == null)
        {
            throw new KeyNotFoundException($"Camera with ID {request.Id} not found or has already been deleted.");
        }

        // Realizar eliminación lógica
        camera.Delete();
        camera.LastModifiedAtUtc = DateTime.UtcNow;

        // Guardar los cambios en la base de datos
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
