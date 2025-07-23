using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Exceptions;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Sightings.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetSightingsByMotorcycleId;

public class GetSightingsByMotorcycleIdQueryHandler : IRequestHandler<GetSightingsByMotorcycleIdQuery, IEnumerable<SightingDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSightingsByMotorcycleIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SightingDto>> Handle(GetSightingsByMotorcycleIdQuery request, CancellationToken cancellationToken)
    {
        var motorcycleExists = await _context.Motorcycles
            .AnyAsync(m => m.Id == request.MotorcycleId && !m.IsDeleted, cancellationToken);

        if (!motorcycleExists)
            throw new NotFoundException(nameof(Domain.Entities.Motorcycle), request.MotorcycleId);

        // 1. Obtener las entidades de la BD a la memoria
        var sightings = await _context.Sightings
            .Include(s => s.Camera)
            .Include(s => s.Motorcycle)
                .ThenInclude(m => m.Brand)
            .Where(s => s.MotorcycleId == request.MotorcycleId && !s.IsDeleted)
            .OrderByDescending(s => s.SightingTimeUtc)
            .ToListAsync(cancellationToken);

        // 2. Mapear los objetos en memoria para que se ejecute el resolver
        return _mapper.Map<IEnumerable<SightingDto>>(sightings);
    }
}
