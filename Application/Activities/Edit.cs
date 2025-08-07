using System.Net;
using Application.Core;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Edit
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime? Date { get; set; }
        public string City { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            //RuleFor(x => x.Id).NotEmpty();  // Note! Excluded
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _dataContext;

        public Handler(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _dataContext.Activities.FindAsync(request.Id);

             if (activity == null) throw new RestException(HttpStatusCode.NotFound,
                new { activity = "Activity not found." });

            activity.Title = request.Title ?? activity.Title;
            activity.Description = request.Description ?? activity.Description;
            activity.Category = request.Category ?? activity.Category;
            activity.Date = request.Date ?? activity.Date;
            activity.City = request.City ?? activity.City;
            activity.Venue = request.Venue ?? activity.Venue;

            var result = await _dataContext.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Problem saving changes");

            return Result<Unit>.Success(Unit.Value);
        }
    }

}
