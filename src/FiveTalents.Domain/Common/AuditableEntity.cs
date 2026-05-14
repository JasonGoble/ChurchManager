namespace FiveTalents.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public int OrganizationId { get; set; }
}
