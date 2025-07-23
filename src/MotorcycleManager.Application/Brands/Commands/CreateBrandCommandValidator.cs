using FluentValidation;

namespace MotorcycleManager.Application.Brands.Commands;

public class CreateBrandCommandValidator : AbstractValidator<CreateBrandCommand>
{
    public CreateBrandCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("El nombre de la marca es requerido.")
            .Length(1, 100)
            .WithMessage("El nombre de la marca debe tener entre 1 y 100 caracteres.");
    }
}
