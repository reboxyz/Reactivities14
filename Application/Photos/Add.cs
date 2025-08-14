using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class Add
{
    public class Command : IRequest<Result<Photo>>
    {
        public IFormFile? File { get; set; }
    }

    public class CommandValidator: AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.File).NotNull();
        }
    }

    public class Handler : IRequestHandler<Command, Result<Photo>>
    {
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
        {
            _context = context;
            _photoAccessor = photoAccessor;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Include(u => u.Photos)
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

            if (user is null) return null; // 404

            var photoUploadResult = await _photoAccessor.AddPhoto(request.File!);

            var photo = new Photo
            {
                Url = photoUploadResult.Url,
                Id = photoUploadResult.PublicId
            };

            // Main photo logic
            if (!user.Photos.Any(x => x.IsMain))
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Result<Photo>.Success(photo);

            return Result<Photo>.Failure("Problem adding photo");
        }
    }
}
