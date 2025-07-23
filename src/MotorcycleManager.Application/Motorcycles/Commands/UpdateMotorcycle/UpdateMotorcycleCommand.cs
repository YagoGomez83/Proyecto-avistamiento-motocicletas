using MediatR;
using MotorcycleManager.Domain.Enums;

namespace MotorcycleManager.Application.Motorcycles.Commands.UpdateMotorcycle;

public record UpdateMotorcycleCommand(
    Guid Id,
    Guid BrandId,
    string? LicensePlate,
    string? Model,
    int? Year,
    EngineDisplacement? Displacement,
    string? Color
) : IRequest<Unit>;
