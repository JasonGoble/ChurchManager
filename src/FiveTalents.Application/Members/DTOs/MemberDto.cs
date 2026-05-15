using FiveTalents.Domain.Members;

namespace FiveTalents.Application.Members.DTOs;

public record MemberAddressDto(
    int Id,
    int ContactTypeId,
    string ContactTypeName,
    bool IsPrimary,
    string? AddressLine1,
    string? AddressLine2,
    string? City,
    string? State,
    string? PostalCode,
    string? Country
);

public record MemberEmailDto(
    int Id,
    int ContactTypeId,
    string ContactTypeName,
    bool IsPrimary,
    string Email
);

public record MemberPhoneDto(
    int Id,
    int ContactTypeId,
    string ContactTypeName,
    bool IsPrimary,
    string PhoneNumber,
    bool IsMobile
);

public record MemberDto(
    int Id,
    string FirstName,
    string LastName,
    DateTime? DateOfBirth,
    Gender? Gender,
    MaritalStatus? MaritalStatus,
    MemberStatus Status,
    DateTime? JoinDate,
    string? ProfilePhotoUrl,
    string? Notes,
    int OrganizationId,
    string? OrgName,
    string? UserId,
    bool IsLinkedToUser,
    bool SharePhoneWithNetwork,
    bool ShareEmailWithNetwork,
    bool ShareAddressWithNetwork,
    IReadOnlyList<MemberAddressDto> Addresses,
    IReadOnlyList<MemberEmailDto> Emails,
    IReadOnlyList<MemberPhoneDto> Phones
);

// Returned when viewing a member from a parent org (hierarchy visibility, not direct membership)
public record MemberSummaryDto(
    int Id,
    string FullName,
    string? PrimaryEmail,
    string? PrimaryPhone,
    MemberStatus Status,
    int OrganizationId,
    string? OrgName = null
);
