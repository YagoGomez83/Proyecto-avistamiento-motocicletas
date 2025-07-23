using MediatR;
using Microsoft.AspNetCore.Http;

namespace MotorcycleManager.Application.Sightings.Commands.UpdateSighting;

public record UpdateSightingCommand(
    Guid Id,
    Guid CameraId,
    DateTime SightingTimeUtc,
    string? Notes = null,
    IFormFile? NewImageFile = null
) : IRequest<Unit>;
