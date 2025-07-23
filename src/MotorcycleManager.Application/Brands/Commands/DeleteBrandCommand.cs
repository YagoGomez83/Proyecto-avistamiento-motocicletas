using MediatR;

namespace MotorcycleManager.Application.Brands.Commands;

public class DeleteBrandCommand : IRequest
{
    public Guid Id { get; set; }

    public DeleteBrandCommand(Guid id)
    {
        Id = id;
    }
}
