using MediatR;
using MotorcycleManager.Application.Cameras.Dtos;

namespace MotorcycleManager.Application.Cameras.Queries;

/// <summary>
/// Query para obtener todas las cámaras registradas en el sistema.
/// </summary>
public class GetCamerasQuery : IRequest<IEnumerable<CameraDto>>
{
    // Esta query no necesita parámetros ya que devuelve todas las cámaras
}
