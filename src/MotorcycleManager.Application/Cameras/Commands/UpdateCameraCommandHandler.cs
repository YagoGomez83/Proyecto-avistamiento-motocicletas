using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Domain.ValueObjects;

namespace MotorcycleManager.Application.Cameras.Commands;

/// <summary>
/// Handler para procesar el comando de actualizar una cámara existente.
/// </summary>
public class UpdateCameraCommandHandler : IRequestHandler<UpdateCameraCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateCameraCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateCameraCommand request, CancellationToken cancellationToken)
    {
        // Buscar la cámara existente
        var camera = await _context.Cameras
            .FirstOrDefaultAsync(c => c.Id == request.Id && !c.IsDeleted, cancellationToken);

        if (camera == null)
        {
            throw new KeyNotFoundException($"Camera with ID {request.Id} not found or has been deleted.");
        }

        // Crear el ValueObject Address si se proporcionó ubicación
        Address? address = null;
        if (request.Location != null && 
            !string.IsNullOrWhiteSpace(request.Location.Street) && 
            !string.IsNullOrWhiteSpace(request.Location.City))
        {
            address = new Address(request.Location.Street, request.Location.City);
        }

        // Actualizar las propiedades de la cámara
        camera.UpdateDetails(request.Name, address);

        // Actualizar la fecha de modificación
        camera.LastModifiedAtUtc = DateTime.UtcNow;

        // Guardar los cambios en la base de datos
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
