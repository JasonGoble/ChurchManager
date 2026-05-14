using FiveTalents.Domain.Common;
using FiveTalents.Domain.Members;

namespace FiveTalents.Domain.Communication;

public enum DeliveryStatus { Pending, Sent, Delivered, Failed, Bounced }

public class CommunicationLog : AuditableEntity
{
    public CommunicationType Type { get; set; }
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
    public string Recipient { get; set; } = default!;
    public int? MemberId { get; set; }
    public Member? Member { get; set; }
    public DeliveryStatus Status { get; set; } = DeliveryStatus.Pending;
    public DateTime? SentAt { get; set; }
    public string? ErrorMessage { get; set; }
    public int? TemplateId { get; set; }
    public CommunicationTemplate? Template { get; set; }
}
