using MediatR;
using MotorcycleManager.Application.Motorcycles.Dtos;

namespace MotorcycleManager.Application.Motorcycles.Queries.GetAllMotorcycles;

public class GetAllMotorcyclesQuery : IRequest<IEnumerable<MotorcycleDto>>
{
    // Parámetros de Filtrado (opcionales)
    public Guid? BrandId { get; set; }
    public string? Model { get; set; }
    public string? SearchTerm { get; set; }

    // Parámetros de Paginación
    private const int MaxPageSize = 50;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}