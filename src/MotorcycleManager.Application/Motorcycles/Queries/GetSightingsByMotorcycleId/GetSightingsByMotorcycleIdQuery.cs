using MediatR;
using MotorcycleManager.Application.Sightings.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetSightingsByMotorcycleId;

public record GetSightingsByMotorcycleIdQuery(Guid MotorcycleId) : IRequest<IEnumerable<SightingDto>>;
