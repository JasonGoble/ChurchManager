using FiveTalents.Domain.Common;
using FiveTalents.Domain.Members;

namespace FiveTalents.Domain.Giving;

public enum PledgeFrequency { Weekly, BiWeekly, Monthly, Quarterly, Annually, OneTime }

public class DonationPledge : AuditableEntity
{
    public int MemberId { get; set; }
    public Member Member { get; set; } = default!;
    public int DonationFundId { get; set; }
    public DonationFund Fund { get; set; } = default!;
    public decimal TotalAmount { get; set; }
    public decimal AmountPerPeriod { get; set; }
    public PledgeFrequency Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Notes { get; set; }
    public ICollection<Donation> Donations { get; set; } = [];
    public decimal AmountFulfilled => Donations.Where(d => d.Status == DonationStatus.Completed).Sum(d => d.Amount);
}
