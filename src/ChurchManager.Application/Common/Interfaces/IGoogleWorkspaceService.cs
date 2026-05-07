namespace ChurchManager.Application.Common.Interfaces;

public interface IGoogleWorkspaceService
{
    Task<IEnumerable<GoogleWorkspaceUser>> GetUsersAsync(int organizationId, CancellationToken cancellationToken = default);
    Task<GoogleWorkspaceUser?> GetUserAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> CreateCalendarEventAsync(int organizationId, GoogleCalendarEvent calendarEvent, CancellationToken cancellationToken = default);
    Task<bool> SendEmailAsync(int organizationId, string to, string subject, string body, CancellationToken cancellationToken = default);
    Task<bool> IsConfiguredForOrganizationAsync(int organizationId, CancellationToken cancellationToken = default);
}

public record GoogleWorkspaceUser(string Email, string Name, string? PhotoUrl, bool IsActive);
public record GoogleCalendarEvent(string Title, string Description, DateTime Start, DateTime End, string? Location, IEnumerable<string> AttendeeEmails);
