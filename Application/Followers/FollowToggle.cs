using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUsername { get; set; } = string.Empty; // Note! The current username will be retrieved from the JWT 
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

            var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

            if (target == null) return null; // 404

            var following = await _context.UserFollowings.FindAsync(observer!.Id, target.Id); // Primary keys

            if (following == null)
            {
                following = new UserFollowing
                {
                    Observer = observer,
                    Target = target
                };

                _context.UserFollowings.Add(following);  // Follow
            }
            else
            {
                _context.UserFollowings.Remove(following); // Unfollow
            }

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Result<Unit>.Success(Unit.Value);

            return Result<Unit>.Failure("Failed to update following");
        }
    }
}
