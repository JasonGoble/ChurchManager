using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Members;

public class MemberAddress : BaseEntity
{
    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;
    public int ContactTypeId { get; set; }
    public ContactType ContactType { get; set; } = null!;
    public bool IsPrimary { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}
