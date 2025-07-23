using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Cameras.Dtos;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Cameras.Queries;

/// <summary>
/// Handler para procesar la consulta de obtener todas las cámaras.
/// </summary>
public class GetCamerasQueryHandler : IRequestHandler<GetCamerasQuery, IEnumerable<CameraDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCamerasQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CameraDto>> Handle(GetCamerasQuery request, CancellationToken cancellationToken)
    {
        // Obtener todas las cámaras activas de la base de datos (excluir eliminadas)
        var cameras = await _context.Cameras
            .Where(c => !c.IsDeleted) // Excluir cámaras eliminadas lógicamente
            .AsNoTracking() // No necesitamos tracking para consultas de solo lectura
            .OrderBy(c => c.Name) // Ordenar por nombre para consistencia
            .ToListAsync(cancellationToken);

        // Mapear las entidades Camera a CameraDto usando AutoMapper
        var cameraDtos = _mapper.Map<IEnumerable<CameraDto>>(cameras);

        return cameraDtos;
    }
}
