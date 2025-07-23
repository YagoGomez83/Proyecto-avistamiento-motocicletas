using MediatR;
using MotorcycleManager.Domain.Enums;

namespace MotorcycleManager.Application.Motorcycles.Commands.CreateMotorcycle;

public record CreateMotorcycleCommand(
    Guid BrandId,
    string? LicensePlate,
    string? Model,
    int? Year,
    EngineDisplacement? Displacement,
    string? Color
) : IRequest<Guid>;
