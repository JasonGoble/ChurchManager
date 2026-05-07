using ChurchManager.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace ChurchManager.Infrastructure.Services.Email;

public class SmtpEmailService(ILogger<SmtpEmailService> logger) : IEmailService
{
    public Task SendAsync(string to, string subject, string body, bool isHtml = true, CancellationToken cancellationToken = default)
        => SendAsync([to], subject, body, isHtml, cancellationToken);

    public async Task SendAsync(IEnumerable<string> recipients, string subject, string body, bool isHtml = true, CancellationToken cancellationToken = default)
    {
        // TODO: implement SMTP / SendGrid / AWS SES
        logger.LogInformation("Email to {Recipients}: {Subject}", string.Join(", ", recipients), subject);
        await Task.CompletedTask;
    }
}
