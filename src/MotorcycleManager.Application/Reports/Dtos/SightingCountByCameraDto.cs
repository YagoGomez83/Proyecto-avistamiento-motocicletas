namespace MotorcycleManager.Application.Reports.Dtos;

/// <summary>
/// DTO que representa el conteo de avistamientos agrupados por cámara.
/// Utilizado para generar reportes y dashboards que muestren la actividad por cámara.
/// </summary>
public class SightingCountByCameraDto
{
    /// <summary>
    /// Nombre de la cámara
    /// </summary>
    public string CameraName { get; set; } = string.Empty;

    /// <summary>
    /// Número total de avistamientos registrados por esta cámara
    /// </summary>
    public int Count { get; set; }
}
