using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Exceptions;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Motorcycles.Commands.DeleteMotorcycle;

public class DeleteMotorcycleCommandHandler : IRequestHandler<DeleteMotorcycleCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteMotorcycleCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(DeleteMotorcycleCommand request, CancellationToken cancellationToken)
    {
        var motorcycle = await _context.Motorcycles
            .FirstOrDefaultAsync(m => m.Id == request.Id && !m.IsDeleted, cancellationToken);

        if (motorcycle == null)
            throw new NotFoundException(nameof(Domain.Entities.Motorcycle), request.Id);

        // Borrado lógico
        motorcycle.IsDeleted = true;
        motorcycle.LastModifiedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
