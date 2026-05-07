using ChurchManager.Domain.Attendance;
namespace ChurchManager.Application.Attendance.DTOs;
public record AttendanceSessionDto(int Id, string Name, DateTime SessionDate, SessionType Type, int PresentCount, int OrganizationId);
public record AttendanceRecordDto(int Id, int MemberId, string MemberName, bool IsPresent, bool IsFirstTime);
