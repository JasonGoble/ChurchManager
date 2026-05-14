namespace FiveTalents.Application.Common.Interfaces;

public interface IUserLinkingService
{
    Task<UserLinkInfo?> FindByIdAsync(string userId);
    Task<UserLinkInfo?> FindByEmailAsync(string email);
    Task<IReadOnlyList<UserLinkInfo>> GetUnlinkedUsersAsync();
    Task SetMemberLinkAsync(string userId, int? memberId);
    Task<string> CreateUserForMemberAsync(string email, string firstName, string lastName, int memberId, int primaryOrgId);
    Task<string> GenerateInviteTokenAsync(string userId);
}

public record UserLinkInfo(string Id, string Email, string FullName, int? MemberId, bool IsActive);
