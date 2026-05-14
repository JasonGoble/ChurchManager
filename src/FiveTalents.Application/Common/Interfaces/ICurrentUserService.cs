namespace FiveTalents.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    int? OrganizationId { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
    IEnumerable<int> GetAccessibleOrganizationIds();
}
