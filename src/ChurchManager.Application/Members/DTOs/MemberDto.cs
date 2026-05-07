using ChurchManager.Domain.Members;

namespace ChurchManager.Application.Members.DTOs;

public record MemberDto(
    int Id,
    string FirstName,
    string LastName,
    string? Email,
    string? PhoneNumber,
    DateTime? DateOfBirth,
    Gender? Gender,
    MaritalStatus? MaritalStatus,
    MemberStatus Status,
    DateTime? JoinDate,
    string? ProfilePhotoUrl,
    string? Address,
    string? City,
    string? State,
    string? PostalCode,
    string? Country,
    string? Notes,
    int OrganizationId,
    string? OrgName,
    string? UserId,
    bool IsLinkedToUser,
    bool SharePhoneWithNetwork,
    bool ShareEmailWithNetwork,
    bool ShareAddressWithNetwork
);

// Returned when viewing a member from a parent org (hierarchy visibility, not direct membership)
public record MemberSummaryDto(
    int Id,
    string FullName,
    string? Email,
    string? PhoneNumber,
    MemberStatus Status,
    int OrganizationId,
    string? OrgName = null
);
