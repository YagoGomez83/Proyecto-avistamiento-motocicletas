using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Sightings.Commands.DeleteSighting;

/// <summary>
/// Handler para eliminar un avistamiento (borrado lógico).
/// </summary>
public class DeleteSightingCommandHandler : IRequestHandler<DeleteSightingCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteSightingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteSightingCommand request, CancellationToken cancellationToken)
    {
        // Buscar el avistamiento por ID
        var sighting = await _context.Sightings
            .FirstOrDefaultAsync(s => s.Id == request.SightingId, cancellationToken);

        if (sighting == null)
        {
            throw new KeyNotFoundException($"Avistamiento con ID {request.SightingId} no encontrado");
        }

        // Marcar como eliminado (borrado lógico)
        sighting.IsDeleted = true;
        sighting.LastModifiedAtUtc = DateTime.UtcNow;

        // Guardar los cambios
        await _context.SaveChangesAsync(cancellationToken);
        
        return Unit.Value;
    }
}
