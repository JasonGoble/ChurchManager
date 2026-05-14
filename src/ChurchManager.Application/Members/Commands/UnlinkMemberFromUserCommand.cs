using ChurchManager.Application.Common.Exceptions;
using ChurchManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Members.Commands;

public record UnlinkMemberFromUserCommand(int MemberId) : IRequest;

public class UnlinkMemberFromUserCommandHandler(
    IApplicationDbContext db,
    IUserLinkingService userService
) : IRequestHandler<UnlinkMemberFromUserCommand>
{
    public async Task Handle(UnlinkMemberFromUserCommand request, CancellationToken cancellationToken)
    {
        var member = await db.Members.FirstOrDefaultAsync(m => m.Id == request.MemberId, cancellationToken)
            ?? throw new NotFoundException("Member", request.MemberId);

        if (member.UserId != null)
            await userService.SetMemberLinkAsync(member.UserId, null);

        member.UserId = null;
        await db.SaveChangesAsync(cancellationToken);
    }
}
