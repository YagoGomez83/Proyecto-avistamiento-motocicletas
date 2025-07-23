using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Motorcycles.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetMotorcycleByLicensePlate;

public class GetMotorcycleByLicensePlateQueryHandler : IRequestHandler<GetMotorcycleByLicensePlateQuery, MotorcycleDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper; // <-- Inyectar IMapper

    public GetMotorcycleByLicensePlateQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper; // <-- Asignar en el constructor
    }

    public async Task<MotorcycleDto?> Handle(GetMotorcycleByLicensePlateQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.LicensePlate))
            return null;

        // Usar ProjectTo para un mapeo limpio y eficiente
        return await _context.Motorcycles
            .Where(m => m.LicensePlate != null && m.LicensePlate.ToLower() == request.LicensePlate.ToLower())
            .ProjectTo<MotorcycleDto>(_mapper.ConfigurationProvider) // <-- Mapeo automático
            .FirstOrDefaultAsync(cancellationToken);
    }
}

