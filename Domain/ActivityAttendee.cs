namespace Domain
{
    // Note! Join table for Activity and AppUser
    public class ActivityAttendee
    {
        public string AppUserId { get; set; } = string.Empty;
        public AppUser AppUser { get; set; } = new AppUser();
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; } = new Activity();
        public bool IsHost { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.Now;
    }
}