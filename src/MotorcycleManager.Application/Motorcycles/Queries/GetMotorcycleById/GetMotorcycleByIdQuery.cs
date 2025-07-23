using MediatR;
using MotorcycleManager.Application.Motorcycles.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetMotorcycleById;

public record GetMotorcycleByIdQuery(Guid Id) : IRequest<MotorcycleDto?>;
