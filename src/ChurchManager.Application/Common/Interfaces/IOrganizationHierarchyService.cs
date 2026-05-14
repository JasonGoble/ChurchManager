namespace ChurchManager.Application.Common.Interfaces;

public interface IOrganizationHierarchyService
{
    Task<IReadOnlyList<int>> GetDescendantOrgIdsAsync(int rootOrgId, CancellationToken ct = default);
}
