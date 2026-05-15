using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Members;

public enum ContactTypeCategory { Address, Email, Phone }

public class ContactType : BaseEntity
{
    public ContactTypeCategory Category { get; set; }
    public string Name { get; set; } = default!;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
