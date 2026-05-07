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
    int OrganizationId
);

public record MemberSummaryDto(int Id, string FullName, string? Email, string? PhoneNumber, MemberStatus Status);
