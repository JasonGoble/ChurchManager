using FiveTalents.Domain.Common;
using FiveTalents.Domain.Members;

namespace FiveTalents.Domain.Attendance;

public class AttendanceRecord : BaseEntity
{
    public int AttendanceSessionId { get; set; }
    public AttendanceSession Session { get; set; } = default!;
    public int MemberId { get; set; }
    public Member Member { get; set; } = default!;
    public bool IsPresent { get; set; } = true;
    public bool IsFirstTime { get; set; }
    public string? Notes { get; set; }
    public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
}
