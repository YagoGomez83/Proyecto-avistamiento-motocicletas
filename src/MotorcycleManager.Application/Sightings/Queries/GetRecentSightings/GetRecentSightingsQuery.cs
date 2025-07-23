using MediatR;
using MotorcycleManager.Application.Sightings.Dtos;

namespace MotorcycleManager.Application.Sightings.Queries.GetRecentSightings;

public record GetRecentSightingsQuery(int Limit = 10) : IRequest<IEnumerable<SightingDto>>;
