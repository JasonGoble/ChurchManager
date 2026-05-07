namespace ChurchManager.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public int OrganizationId { get; set; }
}
