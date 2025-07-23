using MediatR;

namespace MotorcycleManager.Application.Sightings.Commands.DeleteSighting;

/// <summary>
/// Comando para eliminar un avistamiento (borrado lógico).
/// </summary>
/// <param name="SightingId">ID del avistamiento a eliminar.</param>
public record DeleteSightingCommand(Guid SightingId) : IRequest;
