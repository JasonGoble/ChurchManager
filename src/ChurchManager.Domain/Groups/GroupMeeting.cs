using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Groups;

public class GroupMeeting : BaseEntity
{
    public int GroupId { get; set; }
    public Group Group { get; set; } = default!;
    public DateTime MeetingDate { get; set; }
    public string? Topic { get; set; }
    public string? Notes { get; set; }
    public string? Location { get; set; }
    public int? AttendanceCount { get; set; }
}
