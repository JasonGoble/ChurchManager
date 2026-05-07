using ChurchManager.Domain.Common;
using ChurchManager.Domain.Members;

namespace ChurchManager.Domain.Events;

public enum EventStatus { Draft, Published, Cancelled, Completed }
public enum EventVisibility { Public, MembersOnly, InviteOnly }

public class ChurchEvent : AuditableEntity
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public EventStatus Status { get; set; } = EventStatus.Draft;
    public EventVisibility Visibility { get; set; } = EventVisibility.Public;
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public bool IsAllDay { get; set; }
    public bool IsRecurring { get; set; }
    public string? RecurrenceRule { get; set; }
    public string? Location { get; set; }
    public string? OnlineUrl { get; set; }
    public int? MaxCapacity { get; set; }
    public bool RequiresRegistration { get; set; }
    public DateTime? RegistrationDeadline { get; set; }
    public string? ImageUrl { get; set; }
    public int? CoordinatorMemberId { get; set; }
    public Member? Coordinator { get; set; }
    public ICollection<EventRegistration> Registrations { get; set; } = [];
}
