namespace Domain;

// Join table for self-referencing many-to-many AppUser relationship
public class UserFollowing
{
        // Note! Observer is the person who will 'follow'
    public string ObserverId { get; set; } = string.Empty;
    public AppUser Observer { get; set; } = new AppUser();
        // Note! Target is the person being 'followed'
    public string TargetId { get; set; } = string.Empty;
    public AppUser Target { get; set; } = new AppUser();   
}
