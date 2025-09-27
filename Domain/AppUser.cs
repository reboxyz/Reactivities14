using Microsoft.AspNetCore.Identity;

namespace Domain;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    // Note! Many-to-many relationship between AppUser and Activity using ActivityAttendee as join table
    public ICollection<ActivityAttendee> Activities { get; set; } = new List<ActivityAttendee>();
    // Note! One-to-many relationship between AppUser and Photo
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    public ICollection<UserFollowing> Followings { get; set; } = new List<UserFollowing>(); // Note! Current User's followings
    public ICollection<UserFollowing> Followers { get; set; } = new List<UserFollowing>(); // Note! Other AppUser observing or following this current User
}
