using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirement : IAuthorizationRequirement
{
}

public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
{
    private readonly DataContext _dataContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsHostRequirementHandler(DataContext dataContext, IHttpContextAccessor httpContextAccessor)
    {
        _dataContext = dataContext;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Task.CompletedTask;

        string? activityId = _httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString();

        if (activityId is null) return Task.CompletedTask;

        var attendee = _dataContext.ActivityAttendees
            .AsNoTracking()  // Note! This is very important
            .FirstOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == Guid.Parse(activityId)).Result;

        if (attendee == null) return Task.CompletedTask;

        if (attendee.IsHost) context.Succeed(requirement); // Success

        return Task.CompletedTask;
    }
}
