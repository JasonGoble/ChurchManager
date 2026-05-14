using FiveTalents.Domain.Common;
using FiveTalents.Domain.Organizations;

namespace FiveTalents.Domain.Auth;

public static class Roles
{
    public const string SystemAdmin = "SystemAdmin";
    public const string TopLevelAdmin = "TopLevelAdmin";
    public const string MidLevelAdmin = "MidLevelAdmin";
    public const string LocalAdmin = "LocalAdmin";
    public const string Staff = "Staff";
    public const string Member = "Member";
    public const string ReadOnly = "ReadOnly";
}

public class UserOrganizationRole : BaseEntity
{
    public string UserId { get; set; } = default!;
    public int OrganizationId { get; set; }
    public Organization Organization { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool IsActive { get; set; } = true;
}
