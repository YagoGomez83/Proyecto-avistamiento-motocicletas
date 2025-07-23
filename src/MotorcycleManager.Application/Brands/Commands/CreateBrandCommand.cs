using MediatR;

namespace MotorcycleManager.Application.Brands.Commands;

public class CreateBrandCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
}
