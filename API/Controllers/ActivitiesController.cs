using Application.Activities;
using Application.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BasiApiController
{
    public ActivitiesController()
    {
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery]ActivityParams param,  CancellationToken ct)
    {
        var activities = await Mediator.Send(new List.Query{ Params = param }, ct);
        return HandlePagedResult(activities);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Details(Guid id)
    {
        return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Create.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Edit(Guid id, [FromBody] Edit.Command command)
    {
        command.Id = id;
        return HandleResult(await Mediator.Send(command));
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attend(Guid id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
    }
}
