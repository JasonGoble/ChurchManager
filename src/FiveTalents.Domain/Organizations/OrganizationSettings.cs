using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Organizations;

public class OrganizationSettings : BaseEntity
{
    public int OrganizationId { get; set; }
    public Organization Organization { get; set; } = default!;
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? Currency { get; set; } = "USD";
    public string? FiscalYearStart { get; set; } = "01-01";
    public bool EnableOnlineGiving { get; set; }
    public bool EnableMemberPortal { get; set; }
    public bool EnableAttendanceTracking { get; set; } = true;
    public string? GoogleWorkspaceDomain { get; set; }
    public string? GoogleClientId { get; set; }
    public string? GoogleClientSecret { get; set; }
    public bool GoogleWorkspaceEnabled { get; set; }
}
