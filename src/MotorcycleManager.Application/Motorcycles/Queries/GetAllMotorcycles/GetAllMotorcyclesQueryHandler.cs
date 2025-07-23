using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Motorcycles.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetAllMotorcycles;

public class GetAllMotorcyclesQueryHandler : IRequestHandler<GetAllMotorcyclesQuery, IEnumerable<MotorcycleDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAllMotorcyclesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MotorcycleDto>> Handle(GetAllMotorcyclesQuery request, CancellationToken cancellationToken)
    {
        // 1. Empezamos con una consulta base IQueryable. No se ejecuta nada en la BD todavía.
        var query = _context.Motorcycles
            .Where(m => !m.IsDeleted) // Filtrar motocicletas no eliminadas
            .Include(m => m.Brand) // Incluimos la marca para poder usar su nombre en el mapeo
            .AsNoTracking();

        // 2. Aplicamos los filtros dinámicamente
        if (request.BrandId.HasValue)
        {
            query = query.Where(m => m.BrandId == request.BrandId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Model))
        {
            query = query.Where(m => m.Model != null && m.Model.Contains(request.Model));
        }

        // 3. Aplicamos búsqueda por término general
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(m => 
                (m.LicensePlate != null && m.LicensePlate.ToLower().Contains(searchTerm)) ||
                (m.Model != null && m.Model.ToLower().Contains(searchTerm)) ||
                (m.Brand.Name != null && m.Brand.Name.ToLower().Contains(searchTerm)) ||
                (m.Color != null && m.Color.ToLower().Contains(searchTerm))
            );
        }

        // 4. Aplicamos la paginación
        // Y proyectamos al DTO usando la magia de ProjectTo de AutoMapper
        var pagedMotorcycles = await query
            .OrderBy(m => m.CreatedAtUtc) // Ordenar por fecha de creación
            .ProjectTo<MotorcycleDto>(_mapper.ConfigurationProvider) // Proyección eficiente
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return pagedMotorcycles;
    }
}