using FiveTalents.Domain.Common;
using FiveTalents.Domain.Members;

namespace FiveTalents.Domain.Events;

public enum RegistrationStatus { Registered, WaitListed, Cancelled, Attended }

public class EventRegistration : BaseEntity
{
    public int EventId { get; set; }
    public ChurchEvent Event { get; set; } = default!;
    public int? MemberId { get; set; }
    public Member? Member { get; set; }
    public string? GuestName { get; set; }
    public string? GuestEmail { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Registered;
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
    public int GuestCount { get; set; } = 1;
}
