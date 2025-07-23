using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleManager.Application.Motorcycles.Commands.CreateMotorcycle;
using MotorcycleManager.Application.Motorcycles.Commands.DeleteMotorcycle;
using MotorcycleManager.Application.Motorcycles.Commands.UpdateMotorcycle;
using MotorcycleManager.Application.Motorcycles.Dtos;
using MotorcycleManager.Application.Motorcycles.Queries.GetAllMotorcycles;
using MotorcycleManager.Application.Motorcycles.Queries.GetMotorcycleById;
using MotorcycleManager.Application.Motorcycles.Queries.GetMotorcycleByLicensePlate;
using MotorcycleManager.Application.Motorcycles.Queries.GetSightingsByMotorcycleId;
using MotorcycleManager.Application.Sightings.Dtos;
using MotorcycleManager.Domain.Enums;

namespace MotorcycleManager.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MotorcyclesController : ControllerBase
{
    private readonly IMediator _mediator;

    public MotorcyclesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MotorcycleDto>>> GetAll(
        [FromQuery] string? searchTerm,
        [FromQuery] Guid? brandId,
        [FromQuery] string? model,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = new GetAllMotorcyclesQuery
        {
            SearchTerm = searchTerm,
            BrandId = brandId,
            Model = model,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MotorcycleDto>> GetById(Guid id)
    {
        var query = new GetMotorcycleByIdQuery(id);
        var result = await _mediator.Send(query);

        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("by-license-plate/{licensePlate}")]
    public async Task<ActionResult<MotorcycleDto>> GetByLicensePlate(string licensePlate)
    {
        var query = new GetMotorcycleByLicensePlateQuery(licensePlate);
        var result = await _mediator.Send(query);

        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("{motorcycleId:guid}/sightings")]
    public async Task<ActionResult<IEnumerable<SightingDto>>> GetSightingsForMotorcycle(Guid motorcycleId)
    {
        var query = new GetSightingsByMotorcycleIdQuery(motorcycleId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMotorcycleCommand command)
    {
        var id = await _mediator.Send(command);
        
        // Obtener el objeto completo de la motocicleta recién creada
        var query = new GetMotorcycleByIdQuery(id);
        var createdMotorcycle = await _mediator.Send(query);
        
        return CreatedAtAction(nameof(GetById), new { id }, createdMotorcycle);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMotorcycleRequest request)
    {
        // Comparamos el ID de la ruta con el del cuerpo para seguridad
        if (id != request.Id)
        {
            return BadRequest("ID mismatch");
        }

        var command = new UpdateMotorcycleCommand(
            request.Id, 
            request.BrandId, 
            request.LicensePlate,
            request.Model,
            request.Year,
            request.Displacement,
            request.Color
        );
        
        await _mediator.Send(command);
        return NoContent(); // 204 NoContent si fue exitoso
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteMotorcycleCommand(id);
        await _mediator.Send(command);
        return NoContent(); // 204 NoContent si fue exitoso
    }

    // Record para el request de actualización
    public record UpdateMotorcycleRequest(
        Guid Id,
        Guid BrandId,
        string? LicensePlate,
        string? Model,
        int? Year,
        EngineDisplacement? Displacement,
        string? Color
    );
}
