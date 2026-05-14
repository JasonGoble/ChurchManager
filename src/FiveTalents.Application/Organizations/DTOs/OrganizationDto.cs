namespace FiveTalents.Application.Organizations.DTOs;

public record OrganizationDto(
    int Id,
    string Name,
    int Level,
    int? ParentOrganizationId,
    string? ParentName,
    bool IsActive,
    int MemberCount,
    string? Description,
    string? Email,
    string? PhoneNumber,
    string? Website,
    string? City,
    string? State,
    string? Country,
    string? TimeZone);

public record OrganizationTreeDto(
    int Id,
    string Name,
    int Level,
    bool IsActive,
    IEnumerable<OrganizationTreeDto> Children);

public record OrganizationLevelDto(
    int Id,
    int Level,
    string DisplayName,
    string PluralDisplayName,
    bool IsEnabled);

public record OrganizationSettingsDto(
    int OrganizationId,
    string? PrimaryColor,
    string? SecondaryColor,
    string Currency,
    string FiscalYearStart,
    bool EnableOnlineGiving,
    bool EnableMemberPortal,
    bool EnableAttendanceTracking,
    string? GoogleWorkspaceDomain,
    bool GoogleWorkspaceEnabled);
