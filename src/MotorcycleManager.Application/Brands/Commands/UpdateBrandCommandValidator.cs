using FluentValidation;

namespace MotorcycleManager.Application.Brands.Commands;

public class UpdateBrandCommandValidator : AbstractValidator<UpdateBrandCommand>
{
    public UpdateBrandCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Brand Id is required.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Brand name is required.")
            .MaximumLength(100)
            .WithMessage("Brand name must not exceed 100 characters.");
    }
}
