
namespace Domain;

public class Activity
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string City { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public bool IsCancelled { get; set; }
    // Note! Many-to-many relationship between AppUser and Activity using ActivityAttendee as join table
    public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
    // Note! One-to-many relationship between Activity and Comment
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
