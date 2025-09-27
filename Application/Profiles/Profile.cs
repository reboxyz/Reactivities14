using Domain;

namespace Application.Profiles;

public class Profile
{
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public bool Following { get; set; } // Note! Flag denoting if the currently logged in User is following the target User's profile being handled/displayed
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();


}
