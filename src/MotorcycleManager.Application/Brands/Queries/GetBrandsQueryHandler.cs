using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Brands.Dtos;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Brands.Queries;

public class GetBrandsQueryHandler : IRequestHandler<GetBrandsQuery, IEnumerable<BrandDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBrandsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BrandDto>> Handle(GetBrandsQuery request, CancellationToken cancellationToken)
    {
        var brands = await _context.Brands
            .OrderBy(b => b.Name)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BrandDto>>(brands);
    }
}
