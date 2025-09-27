using MediatR;
using Application.Profiles;
using Persistence;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using Application.Interfaces;

namespace Application.Followers;

public class List
{
    public class Query : IRequest<Result<List<Profile>>>
    {
        public string Predicate { get; set; } = string.Empty; // followers or following
        public string Username { get; set; } = string.Empty; // The user we are interested in
    }

    public class Handler : IRequestHandler<Query, Result<List<Profile>>>
    {
        private readonly DataContext _context;
        private readonly AutoMapper.IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, AutoMapper.IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<List<Profile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<Profile>();

            switch (request.Predicate)
            {
                case "followers": // Note! Condition should use "Target" returning the "Observer"
                    profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                        .Select(u => u.Observer)
                        .ProjectTo<Profile>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUsername()})
                        .ToListAsync();
                    break;

                case "following": // Note! Condition should use "Observer" returning "Target"
                    profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                        .Select(u => u.Target)
                        .ProjectTo<Profile>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUsername()})
                        .ToListAsync();
                    break;
            }

            return Result<List<Profile>>.Success(profiles);
        }
    }
}
