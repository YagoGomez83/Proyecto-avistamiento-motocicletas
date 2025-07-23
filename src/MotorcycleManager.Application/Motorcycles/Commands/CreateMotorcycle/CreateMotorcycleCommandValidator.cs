using FluentValidation;

namespace MotorcycleManager.Application.Motorcycles.Commands.CreateMotorcycle;

public class CreateMotorcycleCommandValidator : AbstractValidator<CreateMotorcycleCommand>
{
    public CreateMotorcycleCommandValidator()
    {
        RuleFor(x => x.BrandId)
            .NotEmpty().WithMessage("El ID de la marca es requerido")
            .NotEqual(Guid.Empty).WithMessage("El ID de la marca debe ser un GUID válido");

        RuleFor(x => x.LicensePlate)
            .MaximumLength(20).WithMessage("La placa no puede exceder 20 caracteres");

        RuleFor(x => x.Model)
            .MaximumLength(100).WithMessage("El modelo no puede exceder 100 caracteres");

        RuleFor(x => x.Year)
            .GreaterThan(1900).WithMessage("El año debe ser mayor a 1900")
            .LessThanOrEqualTo(DateTime.Now.Year + 1).WithMessage("El año no puede ser mayor al año siguiente");

        RuleFor(x => x.Color)
            .MaximumLength(50).WithMessage("El color no puede exceder 50 caracteres");
    }
}
