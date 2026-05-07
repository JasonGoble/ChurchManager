namespace ChurchManager.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string body, bool isHtml = true, CancellationToken cancellationToken = default);
    Task SendAsync(IEnumerable<string> recipients, string subject, string body, bool isHtml = true, CancellationToken cancellationToken = default);
}
