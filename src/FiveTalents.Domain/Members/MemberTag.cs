using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Members;

public class MemberTag : BaseEntity
{
    public int MemberId { get; set; }
    public Member Member { get; set; } = default!;
    public string Tag { get; set; } = default!;
}
