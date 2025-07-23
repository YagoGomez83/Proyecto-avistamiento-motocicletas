using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Exceptions;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Brands.Commands;

public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateBrandCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
    {
        // Buscar la marca por su Id
        var brand = await _context.Brands
            .FirstOrDefaultAsync(b => b.Id == request.Id && !b.IsDeleted, cancellationToken);

        if (brand == null)
            throw new NotFoundException(nameof(Domain.Entities.Brand), request.Id);

        // Verificar que no exista otra marca con el nuevo nombre (para evitar duplicados)
        var existingBrandWithName = await _context.Brands
            .AnyAsync(b => b.Name.ToLower() == request.Name.ToLower() && 
                          b.Id != request.Id && 
                          !b.IsDeleted, 
                     cancellationToken);

        if (existingBrandWithName)
            throw new ValidationException($"Ya existe una marca con el nombre '{request.Name}'.");

        // Actualizar el nombre y guardar los cambios
        brand.UpdateName(request.Name);
        brand.LastModifiedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
