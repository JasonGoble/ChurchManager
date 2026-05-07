using ChurchManager.Application.Common.Interfaces;
using ChurchManager.Application.Members.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Members.Queries;

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

        return await db.Members
            .Where(m => m.UserId == currentUser.UserId && !m.IsDeleted)
            .Select(m => new MemberDto(
                m.Id, m.FirstName, m.LastName, m.Email, m.PhoneNumber,
                m.DateOfBirth, m.Gender, m.MaritalStatus, m.Status, m.JoinDate,
                m.ProfilePhotoUrl, m.Address, m.City, m.State, m.PostalCode, m.Country,
                m.Notes, m.OrganizationId,
                m.UserId, true,
                m.SharePhoneWithNetwork, m.ShareEmailWithNetwork, m.ShareAddressWithNetwork
            ))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
