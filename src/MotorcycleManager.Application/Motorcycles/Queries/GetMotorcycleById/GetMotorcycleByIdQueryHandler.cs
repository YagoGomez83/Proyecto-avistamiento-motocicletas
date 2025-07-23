using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Motorcycles.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetMotorcycleById;

public class GetMotorcycleByIdQueryHandler : IRequestHandler<GetMotorcycleByIdQuery, MotorcycleDto?>
{
    private readonly IApplicationDbContext _context;

    public GetMotorcycleByIdQueryHandler(IApplicationDbContext context) => _context = context;

    public async Task<MotorcycleDto?> Handle(GetMotorcycleByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Motorcycles
            .Include(m => m.Brand)
            .Where(m => m.Id == request.Id)
            .Select(m => new MotorcycleDto
            {
                Id = m.Id,
                LicensePlate = m.LicensePlate,
                Model = m.Model,
                Year = m.Year,
                Displacement = m.Displacement,
                Color = m.Color,
                BrandId = m.BrandId,
                BrandName = m.Brand.Name
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
