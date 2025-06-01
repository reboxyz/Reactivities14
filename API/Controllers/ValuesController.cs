using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValuesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ValuesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Value>>> Get()
    {
        return Ok(await _dataContext.Values.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Value>> GetValue(int id)
    {
        var value = await _dataContext.Values.FindAsync(id);
        return Ok(value);
    }
}
