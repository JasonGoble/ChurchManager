using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Groups;

public class GroupType : AuditableEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Color { get; set; }
    public string? IconName { get; set; }
    public ICollection<Group> Groups { get; set; } = [];
}
