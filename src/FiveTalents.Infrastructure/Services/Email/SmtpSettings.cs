namespace FiveTalents.Infrastructure.Services.Email;

public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; } = 25;
    public string FromAddress { get; set; } = "noreply@FiveTalents.local";
    public string FromName { get; set; } = "FiveTalents";
    public string? Username { get; set; }
    public string? Password { get; set; }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(Host);
}
