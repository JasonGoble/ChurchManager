using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Organizations;

public class Organization : BaseEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public int Level { get; set; }
    public int? ParentOrganizationId { get; set; }
    public Organization? ParentOrganization { get; set; }
    public ICollection<Organization> ChildOrganizations { get; set; } = [];
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? TimeZone { get; set; }
    public bool IsActive { get; set; } = true;
    public OrganizationSettings? Settings { get; set; }
}
