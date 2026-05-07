using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Attendance;

public enum SessionType { SundayService, MidweekService, SpecialEvent, GroupMeeting, Other }

public class AttendanceSession : AuditableEntity
{
    public string Name { get; set; } = default!;
    public DateTime SessionDate { get; set; }
    public SessionType Type { get; set; }
    public int? ServiceNumber { get; set; }
    public string? Notes { get; set; }
    public bool IsLocked { get; set; }
    public ICollection<AttendanceRecord> Records { get; set; } = [];
}
