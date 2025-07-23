using MediatR;

namespace MotorcycleManager.Application.Motorcycles.Commands.DeleteMotorcycle;

public record DeleteMotorcycleCommand(Guid Id) : IRequest<Unit>;
