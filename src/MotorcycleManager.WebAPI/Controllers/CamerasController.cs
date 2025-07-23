using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleManager.Application.Cameras.Commands;
using MotorcycleManager.Application.Cameras.Dtos;
using MotorcycleManager.Application.Cameras.Queries;

namespace MotorcycleManager.WebAPI.Controllers;

/// <summary>
/// Controlador para la gestión de cámaras.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere autenticación para todos los endpoints
public class CamerasController : ControllerBase
{
    private readonly IMediator _mediator;

    public CamerasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Obtiene todas las cámaras registradas en el sistema.
    /// </summary>
    /// <returns>Lista de cámaras.</returns>
    /// <response code="200">Lista de cámaras obtenida exitosamente.</response>
    /// <response code="401">No autorizado.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CameraDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCameras(CancellationToken cancellationToken)
    {
        var query = new GetCamerasQuery();
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Crea una nueva cámara en el sistema.
    /// </summary>
    /// <param name="command">Datos de la cámara a crear.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>ID de la cámara creada.</returns>
    /// <response code="201">Cámara creada exitosamente.</response>
    /// <response code="400">Datos de entrada inválidos.</response>
    /// <response code="401">No autorizado.</response>
    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateCamera([FromBody] CreateCameraCommand command, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var cameraId = await _mediator.Send(command, cancellationToken);
        
        // Devolver Created con la ubicación del nuevo recurso
        return CreatedAtAction(
            nameof(GetCameras), 
            new { id = cameraId }, 
            new { Id = cameraId }
        );
    }

    /// <summary>
    /// Actualiza una cámara existente en el sistema.
    /// </summary>
    /// <param name="id">ID de la cámara a actualizar.</param>
    /// <param name="command">Datos actualizados de la cámara.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Resultado de la operación.</returns>
    /// <response code="204">Cámara actualizada exitosamente.</response>
    /// <response code="400">Datos de entrada inválidos.</response>
    /// <response code="401">No autorizado.</response>
    /// <response code="404">Cámara no encontrada.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCamera(Guid id, [FromBody] UpdateCameraCommand command, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Asegurar que el ID del comando coincida con el ID de la ruta
        command.Id = id;

        try
        {
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Camera with ID {id} not found.");
        }
    }

    /// <summary>
    /// Elimina lógicamente una cámara del sistema.
    /// </summary>
    /// <param name="id">ID de la cámara a eliminar.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Resultado de la operación.</returns>
    /// <response code="204">Cámara eliminada exitosamente.</response>
    /// <response code="401">No autorizado.</response>
    /// <response code="404">Cámara no encontrada.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCamera(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var command = new DeleteCameraCommand(id);
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Camera with ID {id} not found.");
        }
    }
}
