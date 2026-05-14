using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Members;

public class MemberFamily : AuditableEntity
{
    public string FamilyName { get; set; } = default!;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public ICollection<Member> Members { get; set; } = [];
}
