using MediatR;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Domain.Entities;

namespace MotorcycleManager.Application.Sightings.Commands.CreateSighting;

public class CreateSightingCommandHandler : IRequestHandler<CreateSightingCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public CreateSightingCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task<Guid> Handle(CreateSightingCommand request, CancellationToken cancellationToken)
    {
        // Guardar la imagen
        var imagePath = await _fileService.SaveImageAsync(request.ImageFile, "sightings");
        
        // Crear el avistamiento usando el factory method del dominio
        var sighting = Sighting.Create(
            cameraId: request.CameraId,
            motorcycleId: request.MotorcycleId,
            imageUrl: imagePath,
            sightingTimeUtc: request.SightingTimeUtc,
            notes: request.Notes
        );

        // Agregar a la base de datos
        _context.Sightings.Add(sighting);
        await _context.SaveChangesAsync(cancellationToken);

        return sighting.Id;
    }
}
