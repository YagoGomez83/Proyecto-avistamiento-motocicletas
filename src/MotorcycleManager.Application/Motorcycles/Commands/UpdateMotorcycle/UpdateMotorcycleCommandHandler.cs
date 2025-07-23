using MediatR;
using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Exceptions;
using MotorcycleManager.Application.Common.Interfaces;

namespace MotorcycleManager.Application.Motorcycles.Commands.UpdateMotorcycle;

public class UpdateMotorcycleCommandHandler : IRequestHandler<UpdateMotorcycleCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateMotorcycleCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(UpdateMotorcycleCommand request, CancellationToken cancellationToken)
    {
        var motorcycle = await _context.Motorcycles
            .FirstOrDefaultAsync(m => m.Id == request.Id && !m.IsDeleted, cancellationToken);

        if (motorcycle == null)
            throw new NotFoundException(nameof(Domain.Entities.Motorcycle), request.Id);

        // Usar reflection para actualizar las propiedades ya que son private set
        var motorcycleType = typeof(Domain.Entities.Motorcycle);
        
        SetPrivateProperty(motorcycle, motorcycleType, "BrandId", request.BrandId);
        SetPrivateProperty(motorcycle, motorcycleType, "LicensePlate", request.LicensePlate);
        SetPrivateProperty(motorcycle, motorcycleType, "Model", request.Model);
        SetPrivateProperty(motorcycle, motorcycleType, "Year", request.Year);
        SetPrivateProperty(motorcycle, motorcycleType, "Displacement", request.Displacement);
        SetPrivateProperty(motorcycle, motorcycleType, "Color", request.Color);

        motorcycle.LastModifiedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    private static void SetPrivateProperty(object obj, Type type, string propertyName, object? value)
    {
        var property = type.GetProperty(propertyName);
        if (property != null && property.CanWrite)
        {
            property.SetValue(obj, value);
        }
        else
        {
            // Si la propiedad no tiene setter público, usar el backing field
            var field = type.GetField($"<{propertyName}>k__BackingField", 
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            field?.SetValue(obj, value);
        }
    }
}
