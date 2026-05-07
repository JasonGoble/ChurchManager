using ChurchManager.Domain.Common;
using ChurchManager.Domain.Members;

namespace ChurchManager.Domain.Groups;

public enum GroupMemberRole { Member, Leader, CoLeader, Admin }

public class GroupMember : BaseEntity
{
    public int GroupId { get; set; }
    public Group Group { get; set; } = default!;
    public int MemberId { get; set; }
    public Member Member { get; set; } = default!;
    public GroupMemberRole Role { get; set; } = GroupMemberRole.Member;
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LeftDate { get; set; }
    public bool IsActive { get; set; } = true;
}
