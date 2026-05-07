using ChurchManager.Application.Common.Interfaces;
using ChurchManager.Application.Organizations.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Organizations.Queries;

public record GetOrganizationLevelsQuery : IRequest<IEnumerable<OrganizationLevelDto>>;

public class GetOrganizationLevelsQueryHandler(IApplicationDbContext db)
    : IRequestHandler<GetOrganizationLevelsQuery, IEnumerable<OrganizationLevelDto>>
{
    public async Task<IEnumerable<OrganizationLevelDto>> Handle(
        GetOrganizationLevelsQuery request, CancellationToken cancellationToken)
    {
        var levels = await db.OrganizationLevels
            .Where(l => l.IsEnabled)
            .OrderBy(l => l.Level)
            .ToListAsync(cancellationToken);

        return levels.Select(l => new OrganizationLevelDto(
            l.Id, l.Level, l.DisplayName, l.PluralDisplayName, l.IsEnabled));
    }
}
