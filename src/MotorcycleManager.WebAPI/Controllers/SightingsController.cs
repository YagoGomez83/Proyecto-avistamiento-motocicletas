using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleManager.Application.Common.Interfaces;
using MotorcycleManager.Application.Sightings.Commands.CreateSighting;
using MotorcycleManager.Application.Sightings.Commands.DeleteSighting;
using MotorcycleManager.Application.Sightings.Commands.UpdateSighting;
using MotorcycleManager.Application.Sightings.Queries.GetRecentSightings;
using MotorcycleManager.Application.Sightings.Queries.GetSightingById;

namespace MotorcycleManager.WebAPI.Controllers;

/// <summary>
/// Controlador para la gestión de avistamientos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere autenticación para todos los endpoints
public class SightingsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISightingReportService _reportService;

    public SightingsController(IMediator mediator, ISightingReportService reportService)
    {
        _mediator = mediator;
        _reportService = reportService;
    }

    /// <summary>
    /// Obtiene los avistamientos más recientes.
    /// </summary>
    /// <param name="limit">Número máximo de avistamientos a retornar (por defecto: 10).</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Lista de avistamientos recientes.</returns>
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentSightings([FromQuery] int limit = 10, CancellationToken cancellationToken = default)
    {
        var query = new GetRecentSightingsQuery(limit);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene un avistamiento por su ID.
    /// </summary>
    /// <param name="id">ID del avistamiento.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Detalles del avistamiento.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetSightingById(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new GetSightingByIdQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Avistamiento no encontrado" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    /// <summary>
    /// Crea un nuevo avistamiento con imagen.
    /// </summary>
    /// <param name="request">Datos del avistamiento incluyendo la imagen.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>ID del avistamiento creado.</returns>
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateSighting([FromForm] CreateSightingRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (request.ImageFile == null || request.ImageFile.Length == 0)
        {
            return BadRequest(new { message = "Image file is required" });
        }

        var command = new CreateSightingCommand(
            CameraId: request.CameraId,
            MotorcycleId: request.MotorcycleId,
            ImageFile: request.ImageFile,
            SightingTimeUtc: request.SightingTimeUtc,
            Notes: request.Notes
        );

        try
        {
            var sightingId = await _mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetRecentSightings), new { id = sightingId }, new { Id = sightingId });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    /// <summary>
    /// Actualiza un avistamiento existente.
    /// </summary>
    /// <param name="id">ID del avistamiento a actualizar.</param>
    /// <param name="request">Datos actualizados del avistamiento.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Resultado de la operación.</returns>
    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateSighting(Guid id, [FromForm] UpdateSightingRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new UpdateSightingCommand(
            Id: id,
            CameraId: request.CameraId,
            SightingTimeUtc: request.SightingTimeUtc,
            Notes: request.Notes,
            NewImageFile: request.NewImageFile
        );

        try
        {
            await _mediator.Send(command, cancellationToken);
            return Ok(new { message = "Avistamiento actualizado correctamente" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Avistamiento no encontrado" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    /// <summary>
    /// Elimina un avistamiento (borrado lógico).
    /// </summary>
    /// <param name="id">ID del avistamiento a eliminar.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Resultado de la operación.</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSighting(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var command = new DeleteSightingCommand(id);
            await _mediator.Send(command, cancellationToken);
            return Ok(new { message = "Avistamiento eliminado correctamente" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Avistamiento no encontrado" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    #region Endpoints de Reportes

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por cámara.
    /// </summary>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Lista de conteos por cámara ordenada por número de avistamientos (descendente).</returns>
    /// <response code="200">Retorna la lista de conteos por cámara</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpGet("reports/by-camera")]
    [ProducesResponseType(typeof(List<Application.Reports.Dtos.SightingCountByCameraDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSightingCountsByCamera(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _reportService.GetSightingCountsByCameraAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por marca de motocicleta.
    /// </summary>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Lista de conteos por marca ordenada por número de avistamientos (descendente).</returns>
    /// <response code="200">Retorna la lista de conteos por marca</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpGet("reports/by-brand")]
    [ProducesResponseType(typeof(List<Application.Reports.Dtos.SightingCountByBrandDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSightingCountsByBrand(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _reportService.GetSightingCountsByBrandAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene el conteo de avistamientos agrupados por cilindrada del motor.
    /// </summary>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Lista de conteos por cilindrada ordenada por cilindrada (ascendente).</returns>
    /// <response code="200">Retorna la lista de conteos por cilindrada</response>
    /// <response code="500">Error interno del servidor</response>
    /// <remarks>
    /// Solo incluye motocicletas que tienen cilindrada definida.
    /// Los resultados están ordenados de menor a mayor cilindrada (50cc, 110cc, 125cc, etc.).
    /// </remarks>
    [HttpGet("reports/by-engine-displacement")]
    [ProducesResponseType(typeof(List<Application.Reports.Dtos.SightingCountByEngineDisplacementDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSightingCountsByEngineDisplacement(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _reportService.GetSightingCountsByEngineDisplacementAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
        }
    }

    #endregion
}

/// <summary>
/// Request model para crear un avistamiento con FormData.
/// </summary>
public class CreateSightingRequest
{
    public Guid CameraId { get; set; }
    public Guid MotorcycleId { get; set; }
    public IFormFile ImageFile { get; set; } = null!;
    public DateTime SightingTimeUtc { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// Request model para actualizar un avistamiento.
/// </summary>
public class UpdateSightingRequest
{
    public Guid CameraId { get; set; }
    public DateTime SightingTimeUtc { get; set; }
    public string? Notes { get; set; }
    public IFormFile? NewImageFile { get; set; }
}
