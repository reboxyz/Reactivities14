using System.Net;
using Application.Errors;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Delete
{
    public class Command : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Unit>
    {
        private readonly DataContext _dataContext;

        public Handler(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _dataContext.Activities.FindAsync(request.Id);

            if (activity == null) throw new RestException(HttpStatusCode.NotFound,
                new { activity = "Activity not found." });

            _dataContext.Activities.Remove(activity);

            var success = await _dataContext.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new CustomApplicationException("Problem saving changes");
        }
    }
}
