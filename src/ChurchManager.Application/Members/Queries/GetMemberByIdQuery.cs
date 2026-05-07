using ChurchManager.Application.Common.Exceptions;
using ChurchManager.Application.Common.Interfaces;
using ChurchManager.Application.Members.DTOs;
using ChurchManager.Domain.Members;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Members.Queries;

public record GetMemberByIdQuery(int Id) : IRequest<MemberDto>;

public class GetMemberByIdQueryHandler(IApplicationDbContext db) : IRequestHandler<GetMemberByIdQuery, MemberDto>
{
    public async Task<MemberDto> Handle(GetMemberByIdQuery request, CancellationToken cancellationToken)
    {
        var member = await db.Members.FirstOrDefaultAsync(m => m.Id == request.Id && !m.IsDeleted, cancellationToken)
            ?? throw new NotFoundException(nameof(Member), request.Id);

        var orgName = await db.Organizations
            .Where(o => o.Id == member.OrganizationId)
            .Select(o => o.Name)
            .FirstOrDefaultAsync(cancellationToken);

        return new MemberDto(
            member.Id, member.FirstName, member.LastName, member.Email, member.PhoneNumber,
            member.DateOfBirth, member.Gender, member.MaritalStatus, member.Status,
            member.JoinDate, member.ProfilePhotoUrl,
            member.Address, member.City, member.State, member.PostalCode, member.Country,
            member.Notes, member.OrganizationId, orgName,
            member.UserId, member.UserId != null,
            member.SharePhoneWithNetwork, member.ShareEmailWithNetwork, member.ShareAddressWithNetwork);
    }
}
