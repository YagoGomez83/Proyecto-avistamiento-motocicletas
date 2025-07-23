using AutoMapper; // <-- 1. Añadir IMapper
using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Sightings.Dtos;

namespace MotorcycleManager.Application.Sightings.Queries.GetRecentSightings;

public class GetRecentSightingsQueryHandler : IRequestHandler<GetRecentSightingsQuery, IEnumerable<SightingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper; // <-- 2. Añadir dependencia de IMapper

    // 3. Actualizar el constructor para inyectar IMapper
    public GetRecentSightingsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SightingDto>> Handle(GetRecentSightingsQuery request, CancellationToken cancellationToken)
    {
        // 4. Obtener las entidades de la base de datos, incluyendo datos relacionados
        var recentSightings = await _context.Sightings
            .Include(s => s.Camera)
            .Include(s => s.Motorcycle)
                .ThenInclude(m => m.Brand)
            .OrderByDescending(s => s.SightingTimeUtc)
            .Take(request.Limit)
            .ToListAsync(cancellationToken);

        // 5. Usar AutoMapper para convertir la lista de entidades a DTOs
        //    Esto ejecutará el AbsoluteUrlResolver para el campo ImageUrl
        return _mapper.Map<IEnumerable<SightingDto>>(recentSightings);
    }
}