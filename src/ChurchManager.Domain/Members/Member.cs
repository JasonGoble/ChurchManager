using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Members;

public enum Gender { Male, Female, Other, PreferNotToSay }
public enum MaritalStatus { Single, Married, Divorced, Widowed }
public enum MemberStatus { Active, Inactive, Visitor, Deceased }

public class Member : AuditableEntity
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? MiddleName { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? AlternatePhone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public MaritalStatus? MaritalStatus { get; set; }
    public MemberStatus Status { get; set; } = MemberStatus.Active;
    public DateTime? JoinDate { get; set; }
    public DateTime? BaptismDate { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? ProfilePhotoUrl { get; set; }
    public string? Occupation { get; set; }
    public string? Employer { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? Notes { get; set; }
    public string? UserId { get; set; }
    public int? FamilyId { get; set; }
    public MemberFamily? Family { get; set; }
    public ICollection<MemberTag> Tags { get; set; } = [];
}
