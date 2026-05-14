using FiveTalents.Application.Common.Interfaces;
using FiveTalents.Application.Members.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FiveTalents.Application.Members.Queries;

public record GetMyProfileQuery : IRequest<MemberDto?>;

public class GetMyProfileQueryHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser
) : IRequestHandler<GetMyProfileQuery, MemberDto?>
{
    public async Task<MemberDto?> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        if (!currentUser.IsAuthenticated || currentUser.UserId == null)
            return null;

        var member = await db.Members
            .Where(m => m.UserId == currentUser.UserId && !m.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (member == null) return null;

        var orgName = await db.Organizations
            .Where(o => o.Id == member.OrganizationId)
            .Select(o => o.Name)
            .FirstOrDefaultAsync(cancellationToken);

        return new MemberDto(
            member.Id, member.FirstName, member.LastName, member.Email, member.PhoneNumber,
            member.DateOfBirth, member.Gender, member.MaritalStatus, member.Status, member.JoinDate,
            member.ProfilePhotoUrl, member.Address, member.City, member.State, member.PostalCode, member.Country,
            member.Notes, member.OrganizationId, orgName,
            member.UserId, true,
            member.SharePhoneWithNetwork, member.ShareEmailWithNetwork, member.ShareAddressWithNetwork);
    }
}
