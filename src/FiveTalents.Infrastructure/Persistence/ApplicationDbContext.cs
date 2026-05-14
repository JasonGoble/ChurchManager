using FiveTalents.Application.Common.Interfaces;
using FiveTalents.Domain.Attendance;
using FiveTalents.Domain.Auth;
using FiveTalents.Domain.Communication;
using FiveTalents.Domain.Events;
using FiveTalents.Domain.Giving;
using FiveTalents.Domain.Groups;
using FiveTalents.Domain.Members;
using FiveTalents.Domain.Organizations;
using FiveTalents.Domain.Sermons;
using FiveTalents.Domain.Volunteers;
using FiveTalents.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FiveTalents.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options), IApplicationDbContext
{
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<OrganizationLevel> OrganizationLevels => Set<OrganizationLevel>();
    public DbSet<OrganizationSettings> OrganizationSettings => Set<OrganizationSettings>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<MemberFamily> MemberFamilies => Set<MemberFamily>();
    public DbSet<MemberTag> MemberTags => Set<MemberTag>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<GroupType> GroupTypes => Set<GroupType>();
    public DbSet<GroupMember> GroupMembers => Set<GroupMember>();
    public DbSet<GroupMeeting> GroupMeetings => Set<GroupMeeting>();
    public DbSet<AttendanceSession> AttendanceSessions => Set<AttendanceSession>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<DonationFund> DonationFunds => Set<DonationFund>();
    public DbSet<DonationPledge> DonationPledges => Set<DonationPledge>();
    public DbSet<DonationBatch> DonationBatches => Set<DonationBatch>();
    public DbSet<ChurchEvent> Events => Set<ChurchEvent>();
    public DbSet<EventRegistration> EventRegistrations => Set<EventRegistration>();
    public DbSet<CommunicationTemplate> CommunicationTemplates => Set<CommunicationTemplate>();
    public DbSet<CommunicationLog> CommunicationLogs => Set<CommunicationLog>();
    public DbSet<VolunteerOpportunity> VolunteerOpportunities => Set<VolunteerOpportunity>();
    public DbSet<VolunteerAssignment> VolunteerAssignments => Set<VolunteerAssignment>();
    public DbSet<Sermon> Sermons => Set<Sermon>();
    public DbSet<SermonSeries> SermonSeries => Set<SermonSeries>();
    public DbSet<SermonTag> SermonTags => Set<SermonTag>();
    public DbSet<UserOrganizationRole> UserOrganizationRoles => Set<UserOrganizationRole>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global query filters for soft delete
        builder.Entity<Member>().HasQueryFilter(m => !m.IsDeleted);
        builder.Entity<Group>().HasQueryFilter(g => !g.IsDeleted);
        builder.Entity<GroupType>().HasQueryFilter(t => !t.IsDeleted);
        builder.Entity<Sermon>().HasQueryFilter(s => !s.IsDeleted);
        builder.Entity<ChurchEvent>().HasQueryFilter(e => !e.IsDeleted);

        // Group relationships
        builder.Entity<Group>()
            .HasOne(g => g.Organization)
            .WithMany()
            .HasForeignKey(g => g.OrganizationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Group>()
            .HasOne(g => g.Leader)
            .WithMany()
            .HasForeignKey(g => g.LeaderMemberId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Group>()
            .HasOne(g => g.CoLeader)
            .WithMany()
            .HasForeignKey(g => g.CoLeaderMemberId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<GroupMember>()
            .HasOne(gm => gm.Member)
            .WithMany()
            .HasForeignKey(gm => gm.MemberId)
            .OnDelete(DeleteBehavior.Restrict);

        // Organization hierarchy
        builder.Entity<Organization>()
            .HasOne(o => o.ParentOrganization)
            .WithMany(o => o.ChildOrganizations)
            .HasForeignKey(o => o.ParentOrganizationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<OrganizationSettings>()
            .HasOne(s => s.Organization)
            .WithOne(o => o.Settings)
            .HasForeignKey<OrganizationSettings>(s => s.OrganizationId);

        // OrganizationLevel — unique constraint on Level number
        builder.Entity<OrganizationLevel>()
            .HasIndex(l => l.Level)
            .IsUnique();

        // Member ↔ ApplicationUser one-to-one (FK on ApplicationUser side to keep Domain clean)
        builder.Entity<ApplicationUser>()
            .HasOne<Member>()
            .WithOne()
            .HasForeignKey<ApplicationUser>(u => u.MemberId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        // UserOrganizationRole relationships
        builder.Entity<UserOrganizationRole>()
            .HasOne(r => r.Organization)
            .WithMany()
            .HasForeignKey(r => r.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return await base.SaveChangesAsync(cancellationToken);
    }
}
