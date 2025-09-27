using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DataContext : IdentityDbContext<AppUser> //DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Value> Values { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    public DbSet<Photo> Photos { get; set; } // One-to-many relationship between AppUser and Photo
    public DbSet<Comment> Comments { get; set; } // One-to-many relationship between Activity and Comment(s)
    public DbSet<UserFollowing> UserFollowings { get; set; } // Many-to-many self-referencing (AppUser) relationship

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Value>()
            .HasData(
                new Value { Id = 1, Name = "Value 101" },
                new Value { Id = 2, Name = "Value 102" },
                new Value { Id = 3, Name = "Value 103" }
            );

        base.OnModelCreating(builder);

        // Many-to-many relationship between AppUser and Activity
        // Link Table between Activity and AppUser which is the 'ActivityAttendee'
        // Note! A join or link table is just 2 (two) one-to-many tables
        builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));
        // First half: AppUser has many Activities
        builder.Entity<ActivityAttendee>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Activities)
            .HasForeignKey(aa => aa.AppUserId);
        // Second hand: Activity has many Users
        builder.Entity<ActivityAttendee>()
            .HasOne(u => u.Activity)
            .WithMany(a => a.Attendees)
            .HasForeignKey(aa => aa.ActivityId);

        // One-to-many relationship between Activity and Comment
        builder.Entity<Comment>()
            .HasOne(a => a.Activity)
            .WithMany(c => c.Comments)
            .OnDelete(DeleteBehavior.Cascade); // When Activity is deleted then all Comments associated will also be deleted

        // Link Table for Many-to-many self-referencing (AppUser) relationship
        builder.Entity<UserFollowing>(b =>
        {
            b.HasKey(k => new { k.ObserverId, k.TargetId });

            // First half: Observer(AppUser) has many Followings
            b.HasOne(o => o.Observer)
                .WithMany(f => f.Followings)
                .HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Cascade)  // Note! Delete all other AppUsers
                ;

            // Second half: Target(AppUser) has many Followers
            b.HasOne(o => o.Target)
                .WithMany(f => f.Followers)
                .HasForeignKey(o => o.TargetId)
                .OnDelete(DeleteBehavior.Cascade)  // Note! Delete all other AppUsers
            ;
        });

    }


}
