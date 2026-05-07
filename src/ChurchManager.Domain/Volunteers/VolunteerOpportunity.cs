using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Volunteers;

public class VolunteerOpportunity : AuditableEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Department { get; set; }
    public int? MinVolunteers { get; set; }
    public int? MaxVolunteers { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<VolunteerAssignment> Assignments { get; set; } = [];
}
