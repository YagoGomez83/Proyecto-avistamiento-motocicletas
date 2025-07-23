namespace MotorcycleManager.Application.Reports.Dtos;

/// <summary>
/// DTO que representa el conteo de avistamientos agrupados por marca de motocicleta.
/// Utilizado para generar reportes y dashboards que muestren la distribución por marcas.
/// </summary>
public class SightingCountByBrandDto
{
    /// <summary>
    /// Nombre de la marca de la motocicleta
    /// </summary>
    public string BrandName { get; set; } = string.Empty;

    /// <summary>
    /// Número total de avistamientos de motocicletas de esta marca
    /// </summary>
    public int Count { get; set; }
}
