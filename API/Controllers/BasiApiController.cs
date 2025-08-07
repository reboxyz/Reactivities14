using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasiApiController : ControllerBase
{
    private IMediator? _mediator;

    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result == null) return NotFound();

        if (result.IsSuccess && result.Value is not null)
        //if (result.IsSuccess && !result.Value.Equals(default(T)))  Note! This is not working
        {
            return Ok(result.Value);
        }

        if (result.IsSuccess && result.Value is null)
        //if (result.IsSuccess && result.Value.Equals(default(T))) Note! This is not working
        {
            return NotFound();
        }

        return BadRequest(result.Error);
    }
}
