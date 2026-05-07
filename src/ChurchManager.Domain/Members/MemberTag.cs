using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Members;

public class MemberTag : BaseEntity
{
    public int MemberId { get; set; }
    public Member Member { get; set; } = default!;
    public string Tag { get; set; } = default!;
}
