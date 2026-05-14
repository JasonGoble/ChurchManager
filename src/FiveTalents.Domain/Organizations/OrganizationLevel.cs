using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Organizations;

public class OrganizationLevel : BaseEntity
{
    public int Level { get; set; }
    public string DisplayName { get; set; } = default!;
    public string PluralDisplayName { get; set; } = default!;
    public bool IsEnabled { get; set; } = true;
}
