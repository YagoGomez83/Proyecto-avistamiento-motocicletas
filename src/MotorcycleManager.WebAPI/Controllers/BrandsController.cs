using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleManager.Application.Brands.Commands;
using MotorcycleManager.Application.Brands.Queries;
using MotorcycleManager.Application.Common.Exceptions;

namespace MotorcycleManager.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BrandsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BrandsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetBrands()
    {
        var brands = await _mediator.Send(new GetBrandsQuery());
        return Ok(brands);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBrand([FromBody] CreateBrandCommand command)
    {
        var brandId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetBrands), new { id = brandId }, new { Id = brandId });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBrand(Guid id, [FromBody] UpdateBrandCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("Route id does not match command id.");
        }

        try
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBrand(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteBrandCommand(id));
            return NoContent();
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}