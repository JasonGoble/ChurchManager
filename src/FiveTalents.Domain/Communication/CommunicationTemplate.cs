using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Communication;

public enum CommunicationType { Email, SMS, PushNotification }

public class CommunicationTemplate : AuditableEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public CommunicationType Type { get; set; }
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
    public bool IsActive { get; set; } = true;
}
