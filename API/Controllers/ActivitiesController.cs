using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ActivitiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<Activity>>> List(CancellationToken ct)
    {
        return await _mediator.Send(new List.Query(), ct);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> Details(Guid id)
    {
        return await _mediator.Send(new Details.Query { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> Create([FromBody] Create.Command command)
    {
        return await _mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Unit>> Edit(Guid id, [FromBody] Edit.Command command)
    {
        command.Id = id;
        return await _mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Unit>> Delete(Guid id)
    {
        return await _mediator.Send(new Delete.Command { Id = id });
    }
}
