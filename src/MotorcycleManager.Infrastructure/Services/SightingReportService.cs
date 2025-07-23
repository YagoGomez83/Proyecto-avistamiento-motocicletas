using Microsoft.EntityFrameworkCore;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Reports.Dtos;
using MotorcycleManager.Infrastructure.Persistence;

namespace MotorcycleManager.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de reportes de avistamientos.
/// Utiliza Entity Framework Core para realizar consultas agregadas sobre los avistamientos.
/// </summary>
public class SightingReportService : ISightingReportService
{
    private readonly ApplicationDbContext _context;

    public SightingReportService(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por cámara.
    /// Incluye solo avistamientos no eliminados (gracias al filtro global de IsDeleted).
    /// </summary>
    public async Task<List<SightingCountByCameraDto>> GetSightingCountsByCameraAsync()
    {
        var result = await _context.Sightings
            .Include(s => s.Camera)
            .GroupBy(s => s.Camera.Name)
            .Select(g => new SightingCountByCameraDto
            {
                CameraName = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return result;
    }

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por marca de motocicleta.
    /// Incluye solo avistamientos no eliminados (gracias al filtro global de IsDeleted).
    /// </summary>
    public async Task<List<SightingCountByBrandDto>> GetSightingCountsByBrandAsync()
    {
        var result = await _context.Sightings
            .Include(s => s.Motorcycle)
            .ThenInclude(m => m.Brand)
            .GroupBy(s => s.Motorcycle.Brand.Name)
            .Select(g => new SightingCountByBrandDto
            {
                BrandName = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return result;
    }

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por cilindrada del motor.
    /// Incluye solo avistamientos no eliminados (gracias al filtro global de IsDeleted).
    /// Filtra motocicletas que tienen cilindrada definida (no null).
    /// </summary>
    public async Task<List<SightingCountByEngineDisplacementDto>> GetSightingCountsByEngineDisplacementAsync()
    {
        var result = await _context.Sightings
            .Include(s => s.Motorcycle)
            .Where(s => s.Motorcycle.Displacement.HasValue) // Solo incluir motocicletas con cilindrada definida
            .GroupBy(s => s.Motorcycle.Displacement!.Value) // El ! es seguro porque filtramos HasValue arriba
            .Select(g => new SightingCountByEngineDisplacementDto
            {
                EngineDisplacement = g.Key,
                Count = g.Count()
            })
            .OrderBy(x => (int)x.EngineDisplacement) // Ordenar por cilindrada ascendente
            .ToListAsync();

        return result;
    }
}
