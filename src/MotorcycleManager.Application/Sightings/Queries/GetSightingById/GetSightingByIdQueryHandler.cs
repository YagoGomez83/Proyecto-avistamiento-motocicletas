using AutoMapper; // <-- 1. Añadir using
using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Sightings.Dtos;

namespace MotorcycleManager.Application.Sightings.Queries.GetSightingById;

public class GetSightingByIdQueryHandler : IRequestHandler<GetSightingByIdQuery, SightingDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper; // <-- 2. Añadir dependencia de IMapper

    // 3. Actualizar el constructor para inyectar IMapper
    public GetSightingByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SightingDto> Handle(GetSightingByIdQuery request, CancellationToken cancellationToken)
    {
        var sighting = await _context.Sightings
            .Include(s => s.Motorcycle)
                .ThenInclude(m => m.Brand)
            .Include(s => s.Camera)
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, cancellationToken);

        if (sighting == null)
        {
            // Es buena práctica usar una excepción personalizada o más específica si la tienes
            throw new KeyNotFoundException($"Sighting with ID {request.Id} not found");
        }

        // 4. Reemplazar todo el bloque de mapeo manual con una sola línea
        // AutoMapper usará la configuración de MappingProfile, incluyendo el AbsoluteUrlResolver.
        return _mapper.Map<SightingDto>(sighting);
    }
}