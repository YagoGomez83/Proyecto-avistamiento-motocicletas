using MediatR;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Domain.Entities;
using MotorcycleManager.Domain.ValueObjects;

namespace MotorcycleManager.Application.Cameras.Commands;

/// <summary>
/// Handler para procesar el comando de crear una nueva cámara.
/// </summary>
public class CreateCameraCommandHandler : IRequestHandler<CreateCameraCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateCameraCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateCameraCommand request, CancellationToken cancellationToken)
    {
        // Crear el ValueObject Address si se proporcionó ubicación
        Address? address = null;
        if (request.Location != null && 
            !string.IsNullOrWhiteSpace(request.Location.Street) && 
            !string.IsNullOrWhiteSpace(request.Location.City))
        {
            address = new Address(request.Location.Street, request.Location.City);
        }

        // Crear la nueva entidad Camera usando el método estático Create
        var camera = Camera.Create(request.Name, address);

        // Añadir la nueva entidad al contexto
        _context.Cameras.Add(camera);

        // Guardar los cambios en la base de datos
        await _context.SaveChangesAsync(cancellationToken);

        // Devolver el ID de la nueva cámara
        return camera.Id;
    }
}
