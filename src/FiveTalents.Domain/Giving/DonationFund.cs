using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Giving;

public class DonationFund : AuditableEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; }
    public string? GlAccountCode { get; set; }
    public ICollection<Donation> Donations { get; set; } = [];
}
