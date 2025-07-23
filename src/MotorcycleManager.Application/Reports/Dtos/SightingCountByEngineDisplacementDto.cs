using MotorcycleManager.Domain.Enums;

namespace MotorcycleManager.Application.Reports.Dtos;

/// <summary>
/// DTO que representa el conteo de avistamientos agrupados por cilindrada del motor.
/// Utilizado para generar reportes y dashboards que muestren la distribución por cilindradas.
/// </summary>
public class SightingCountByEngineDisplacementDto
{
    /// <summary>
    /// Cilindrada del motor de la motocicleta
    /// </summary>
    public EngineDisplacement EngineDisplacement { get; set; }

    /// <summary>
    /// Número total de avistamientos de motocicletas con esta cilindrada
    /// </summary>
    public int Count { get; set; }

    /// <summary>
    /// Representación en string de la cilindrada para facilitar la visualización
    /// </summary>
    public string DisplacementDisplay => $"{(int)EngineDisplacement}cc";
}
