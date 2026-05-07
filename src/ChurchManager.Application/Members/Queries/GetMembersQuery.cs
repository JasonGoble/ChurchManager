using ChurchManager.Application.Common.Interfaces;
using ChurchManager.Application.Common.Models;
using ChurchManager.Application.Members.DTOs;
using ChurchManager.Domain.Members;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Members.Queries;

public record GetMembersQuery(int OrganizationId, int PageNumber = 1, int PageSize = 25, string? Search = null, MemberStatus? Status = null)
    : IRequest<PaginatedResult<MemberSummaryDto>>;

public class GetMembersQueryHandler(IApplicationDbContext db) : IRequestHandler<GetMembersQuery, PaginatedResult<MemberSummaryDto>>
{
    public async Task<PaginatedResult<MemberSummaryDto>> Handle(GetMembersQuery request, CancellationToken cancellationToken)
    {
        var query = db.Members
            .Where(m => m.OrganizationId == request.OrganizationId && !m.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(m => m.FirstName.Contains(request.Search) || m.LastName.Contains(request.Search) || (m.Email != null && m.Email.Contains(request.Search)));

        if (request.Status.HasValue)
            query = query.Where(m => m.Status == request.Status);

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(m => m.LastName).ThenBy(m => m.FirstName)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(m => new MemberSummaryDto(m.Id, m.FullName, m.Email, m.PhoneNumber, m.Status))
            .ToListAsync(cancellationToken);

        return new PaginatedResult<MemberSummaryDto>(items, total, request.PageNumber, request.PageSize);
    }
}
