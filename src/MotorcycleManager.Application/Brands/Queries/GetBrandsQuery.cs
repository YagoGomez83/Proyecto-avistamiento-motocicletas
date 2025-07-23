using MediatR;
using MotorcycleManager.Application.Brands.Dtos;

namespace MotorcycleManager.Application.Brands.Queries;

public class GetBrandsQuery : IRequest<IEnumerable<BrandDto>>
{
}
