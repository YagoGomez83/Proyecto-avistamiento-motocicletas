using FluentValidation;

namespace MotorcycleManager.Application.Motorcycles.Commands.UpdateMotorcycle;

public class UpdateMotorcycleCommandValidator : AbstractValidator<UpdateMotorcycleCommand>
{
    public UpdateMotorcycleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.");

        RuleFor(x => x.BrandId)
            .NotEmpty()
            .WithMessage("BrandId is required.");

        RuleFor(x => x.LicensePlate)
            .MaximumLength(20)
            .WithMessage("License plate cannot exceed 20 characters.")
            .When(x => !string.IsNullOrEmpty(x.LicensePlate));

        RuleFor(x => x.Model)
            .MaximumLength(100)
            .WithMessage("Model cannot exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Model));

        RuleFor(x => x.Year)
            .GreaterThan(1900)
            .LessThanOrEqualTo(DateTime.Now.Year + 1)
            .WithMessage("Year must be between 1900 and next year.")
            .When(x => x.Year.HasValue);

        RuleFor(x => x.Color)
            .MaximumLength(50)
            .WithMessage("Color cannot exceed 50 characters.")
            .When(x => !string.IsNullOrEmpty(x.Color));
    }
}
