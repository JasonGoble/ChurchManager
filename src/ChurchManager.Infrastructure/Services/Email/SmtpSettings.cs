namespace ChurchManager.Infrastructure.Services.Email;

public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; } = 25;
    public string FromAddress { get; set; } = "noreply@churchmanager.local";
    public string FromName { get; set; } = "ChurchManager";
    public string? Username { get; set; }
    public string? Password { get; set; }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(Host);
}
