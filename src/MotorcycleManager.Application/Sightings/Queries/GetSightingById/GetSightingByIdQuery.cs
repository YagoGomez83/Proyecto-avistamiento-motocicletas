using MediatR;
using MotorcycleManager.Application.Sightings.Dtos;

namespace MotorcycleManager.Application.Sightings.Queries.GetSightingById;

public record GetSightingByIdQuery(Guid Id) : IRequest<SightingDto>;
