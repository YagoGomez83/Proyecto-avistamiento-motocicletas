using MediatR;
using Microsoft.AspNetCore.Http;

namespace MotorcycleManager.Application.Sightings.Commands.CreateSighting;

public record CreateSightingCommand(
    Guid CameraId,
    Guid MotorcycleId,
    IFormFile ImageFile,
    DateTime SightingTimeUtc,
    string? Notes = null
) : IRequest<Guid>;
