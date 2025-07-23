using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Exceptions;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Brands.Commands;

public class DeleteBrandCommandHandler : IRequestHandler<DeleteBrandCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteBrandCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
    {
        // Buscar la marca por su Id
        var brand = await _context.Brands
            .FirstOrDefaultAsync(b => b.Id == request.Id && !b.IsDeleted, cancellationToken);

        if (brand == null)
            throw new NotFoundException(nameof(Domain.Entities.Brand), request.Id);

        // Verificar si tiene motocicletas asociadas
        var hasMotorcycles = await _context.Motorcycles
            .AnyAsync(m => m.BrandId == request.Id && !m.IsDeleted, cancellationToken);

        if (hasMotorcycles)
            throw new ValidationException("No se puede eliminar esta marca porque tiene motocicletas asociadas.");

        // Realizar borrado lógico (soft delete)
        brand.Delete();
        brand.LastModifiedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
