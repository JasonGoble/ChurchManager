using FiveTalents.Domain.Common;
using FiveTalents.Domain.Members;

namespace FiveTalents.Domain.Volunteers;

public enum AssignmentStatus { Scheduled, Confirmed, Completed, NoShow, Cancelled }

public class VolunteerAssignment : BaseEntity
{
    public int OpportunityId { get; set; }
    public VolunteerOpportunity Opportunity { get; set; } = default!;
    public int MemberId { get; set; }
    public Member Member { get; set; } = default!;
    public DateTime ScheduledDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Scheduled;
    public string? Notes { get; set; }
}
