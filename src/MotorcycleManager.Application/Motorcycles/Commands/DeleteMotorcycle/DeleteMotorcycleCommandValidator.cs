using FluentValidation;

namespace MotorcycleManager.Application.Motorcycles.Commands.DeleteMotorcycle;

public class DeleteMotorcycleCommandValidator : AbstractValidator<DeleteMotorcycleCommand>
{
    public DeleteMotorcycleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.");
    }
}
