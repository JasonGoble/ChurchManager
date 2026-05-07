using ChurchManager.Domain.Common;
using ChurchManager.Domain.Members;
using ChurchManager.Domain.Organizations;

namespace ChurchManager.Domain.Groups;

public enum GroupStatus { Active, Inactive, Forming, Disbanded }
public enum MeetingFrequency { Weekly, BiWeekly, Monthly, Quarterly, AsNeeded }

public class Group : AuditableEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Organization Organization { get; set; } = default!;
    public int GroupTypeId { get; set; }
    public GroupType GroupType { get; set; } = default!;
    public GroupStatus Status { get; set; } = GroupStatus.Active;
    public int? LeaderMemberId { get; set; }
    public Member? Leader { get; set; }
    public int? CoLeaderMemberId { get; set; }
    public Member? CoLeader { get; set; }
    public MeetingFrequency? MeetingFrequency { get; set; }
    public string? MeetingDay { get; set; }
    public TimeOnly? MeetingTime { get; set; }
    public string? MeetingLocation { get; set; }
    public int? MaxCapacity { get; set; }
    public bool IsOpenToNewMembers { get; set; } = true;
    public string? ImageUrl { get; set; }
    public ICollection<GroupMember> Members { get; set; } = [];
    public ICollection<GroupMeeting> Meetings { get; set; } = [];
}
