using MediatR;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Domain.Entities;

namespace MotorcycleManager.Application.Motorcycles.Commands.CreateMotorcycle;

public class CreateMotorcycleCommandHandler : IRequestHandler<CreateMotorcycleCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateMotorcycleCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Guid> Handle(CreateMotorcycleCommand request, CancellationToken cancellationToken)
    {
        var motorcycle = Motorcycle.Create(
            request.BrandId,
            request.LicensePlate,
            request.Model,
            request.Year,
            request.Displacement,
            request.Color
        );

        _context.Motorcycles.Add(motorcycle);
        await _context.SaveChangesAsync(cancellationToken);

        return motorcycle.Id;
    }
}
