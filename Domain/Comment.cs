namespace Domain
{
    public class Comment
    {
        public int Id { get; set; }
        public string Body { get; set; } = string.Empty;
        public AppUser Author { get; set; } = new AppUser();
        public Activity Activity { get; set; } = new Activity();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}