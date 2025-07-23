using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Sightings.Commands.UpdateSighting;

public class UpdateSightingCommandHandler : IRequestHandler<UpdateSightingCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public UpdateSightingCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task<Unit> Handle(UpdateSightingCommand request, CancellationToken cancellationToken)
    {
        // Buscar el avistamiento existente
        var sighting = await _context.Sightings
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, cancellationToken);

        if (sighting == null)
        {
            throw new KeyNotFoundException($"Avistamiento con ID {request.Id} no encontrado");
        }

        // Manejar la nueva imagen si se proporciona
        string? newImageUrl = null;
        if (request.NewImageFile != null)
        {
            // Guardar la nueva imagen
            newImageUrl = await _fileService.SaveImageAsync(request.NewImageFile, "sightings");
            
            // Opcional: Eliminar la imagen anterior si existe
            if (!string.IsNullOrEmpty(sighting.ImageUrl))
            {
                await _fileService.DeleteImageAsync(sighting.ImageUrl);
            }
        }

        // Actualizar las propiedades
        sighting.Update(
            cameraId: request.CameraId,
            sightingTimeUtc: request.SightingTimeUtc,
            notes: request.Notes
        );

        // Actualizar la imagen si se proporciona una nueva
        if (newImageUrl != null)
        {
            sighting.UpdateImage(newImageUrl);
        }

        // Guardar los cambios
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
