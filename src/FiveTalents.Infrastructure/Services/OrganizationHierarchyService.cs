using FiveTalents.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FiveTalents.Infrastructure.Services;

public class OrganizationHierarchyService(IApplicationDbContext db) : IOrganizationHierarchyService
{
    public async Task<IReadOnlyList<int>> GetDescendantOrgIdsAsync(int rootOrgId, CancellationToken ct = default)
    {
        var allOrgs = await db.Organizations
            .Select(o => new { o.Id, o.ParentOrganizationId })
            .ToListAsync(ct);

        var result = new List<int>();
        var queue = new Queue<int>();
        queue.Enqueue(rootOrgId);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            result.Add(current);
            foreach (var child in allOrgs.Where(o => o.ParentOrganizationId == current))
                queue.Enqueue(child.Id);
        }

        return result;
    }
}
