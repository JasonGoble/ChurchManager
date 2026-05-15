using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Members;

public class MemberPhone : BaseEntity
{
    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;
    public int ContactTypeId { get; set; }
    public ContactType ContactType { get; set; } = null!;
    public bool IsPrimary { get; set; }
    public string PhoneNumber { get; set; } = default!;
    public bool IsMobile { get; set; }
}
