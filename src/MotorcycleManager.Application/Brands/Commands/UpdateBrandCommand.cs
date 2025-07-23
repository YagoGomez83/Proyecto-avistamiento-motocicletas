using MediatR;

namespace MotorcycleManager.Application.Brands.Commands;

public class UpdateBrandCommand : IRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
