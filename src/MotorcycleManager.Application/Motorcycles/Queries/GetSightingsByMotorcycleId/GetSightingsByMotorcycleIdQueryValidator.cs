using FluentValidation;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetSightingsByMotorcycleId;

public class GetSightingsByMotorcycleIdQueryValidator : AbstractValidator<GetSightingsByMotorcycleIdQuery>
{
    public GetSightingsByMotorcycleIdQueryValidator()
    {
        RuleFor(x => x.MotorcycleId)
            .NotEmpty()
            .WithMessage("MotorcycleId is required.");
    }
}
