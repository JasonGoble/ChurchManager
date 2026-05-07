using ChurchManager.Domain.Common;
using ChurchManager.Domain.Members;

namespace ChurchManager.Domain.Giving;

public enum PaymentMethod { Cash, Check, CreditCard, BankTransfer, Online, Other }
public enum DonationStatus { Pending, Completed, Refunded, Voided }

public class Donation : AuditableEntity
{
    public int? MemberId { get; set; }
    public Member? Member { get; set; }
    public int DonationFundId { get; set; }
    public DonationFund Fund { get; set; } = default!;
    public decimal Amount { get; set; }
    public DateTime DonationDate { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DonationStatus Status { get; set; } = DonationStatus.Completed;
    public string? CheckNumber { get; set; }
    public string? TransactionId { get; set; }
    public string? Notes { get; set; }
    public bool IsAnonymous { get; set; }
    public int? PledgeId { get; set; }
    public DonationPledge? Pledge { get; set; }
    public int? BatchId { get; set; }
    public DonationBatch? Batch { get; set; }
}
