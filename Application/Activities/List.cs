using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<List<Activity>>
    {
        // Props here for the Query
    }

    public class Handler : IRequestHandler<Query, List<Activity>>
    {
        private readonly DataContext _dataContext;
        private readonly ILogger<Handler> _logger;
        public Handler(DataContext dataContext, ILogger<Handler> logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                cancellationToken.ThrowIfCancellationRequested();
                _logger.LogInformation($"Task has completed");
            }
            catch (Exception ex) when (ex is TaskCanceledException)
            {
                _logger.LogInformation(ex, "Task was cancelled");
            }

            var activities = await _dataContext.Activities.ToListAsync(cancellationToken);
            return activities;
        }
    }
}
