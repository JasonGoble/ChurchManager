using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Giving;

public enum BatchStatus { Open, Closed, Reconciled }

public class DonationBatch : AuditableEntity
{
    public string Name { get; set; } = default!;
    public DateTime BatchDate { get; set; }
    public BatchStatus Status { get; set; } = BatchStatus.Open;
    public string? Notes { get; set; }
    public ICollection<Donation> Donations { get; set; } = [];
    public decimal TotalAmount => Donations.Sum(d => d.Amount);
}
