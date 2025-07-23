using MotorcycleManager.Application.Reports.Dtos;

namespace MotorcycleManager.Application.Common.Interfaces;

/// <summary>
/// Interfaz para el servicio de reportes de avistamientos.
/// Define los métodos para obtener datos agregados de avistamientos 
/// agrupados por diferentes criterios para dashboards y reportes.
/// </summary>
public interface ISightingReportService
{
    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por cámara
    /// </summary>
    /// <returns>Lista de DTOs con el nombre de la cámara y el conteo de avistamientos</returns>
    Task<List<SightingCountByCameraDto>> GetSightingCountsByCameraAsync();

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por marca de motocicleta
    /// </summary>
    /// <returns>Lista de DTOs con el nombre de la marca y el conteo de avistamientos</returns>
    Task<List<SightingCountByBrandDto>> GetSightingCountsByBrandAsync();

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por cilindrada del motor
    /// </summary>
    /// <returns>Lista de DTOs con la cilindrada y el conteo de avistamientos</returns>
    Task<List<SightingCountByEngineDisplacementDto>> GetSightingCountsByEngineDisplacementAsync();
}
