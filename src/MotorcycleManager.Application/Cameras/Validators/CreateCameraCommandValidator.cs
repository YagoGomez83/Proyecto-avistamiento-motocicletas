using FluentValidation;
using MotorcycleManager.Application.Cameras.Commands;

namespace MotorcycleManager.Application.Cameras.Validators;

/// <summary>
/// Validador para el comando CreateCameraCommand.
/// </summary>
public class CreateCameraCommandValidator : AbstractValidator<CreateCameraCommand>
{
    public CreateCameraCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("El nombre de la cámara es requerido.")
            .MaximumLength(200)
            .WithMessage("El nombre de la cámara no puede exceder 200 caracteres.");

        // Validaciones para la ubicación (opcional)
        When(x => x.Location != null, () =>
        {
            RuleFor(x => x.Location!.Street)
                .NotEmpty()
                .WithMessage("La calle es requerida cuando se especifica una ubicación.")
                .MaximumLength(500)
                .WithMessage("La calle no puede exceder 500 caracteres.");

            RuleFor(x => x.Location!.City)
                .NotEmpty()
                .WithMessage("La ciudad es requerida cuando se especifica una ubicación.")
                .MaximumLength(100)
                .WithMessage("La ciudad no puede exceder 100 caracteres.");
        });
    }
}
