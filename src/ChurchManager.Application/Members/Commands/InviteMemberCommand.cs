using ChurchManager.Application.Common.Exceptions;
using ChurchManager.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ChurchManager.Application.Members.Commands;

public record InviteMemberCommand(int MemberId, string AcceptBaseUrl) : IRequest;

public class InviteMemberCommandHandler(
    IApplicationDbContext db,
    IUserLinkingService userService,
    IEmailService emailService,
    ILogger<InviteMemberCommandHandler> logger
) : IRequestHandler<InviteMemberCommand>
{
    public async Task Handle(InviteMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await db.Members.FirstOrDefaultAsync(m => m.Id == request.MemberId, cancellationToken)
            ?? throw new NotFoundException("Member", request.MemberId);

        if (string.IsNullOrWhiteSpace(member.Email))
            throw new InvalidOperationException("Member does not have an email address. Add an email before sending an invite.");

        if (member.UserId != null)
            throw new InvalidOperationException("Member already has a linked user account.");

        var userId = await userService.CreateUserForMemberAsync(
            member.Email, member.FirstName, member.LastName, member.Id, member.OrganizationId);

        member.UserId = userId;
        await db.SaveChangesAsync(cancellationToken);

        var token = await userService.GenerateInviteTokenAsync(userId);
        var encodedToken = Uri.EscapeDataString(token);
        var inviteUrl = $"{request.AcceptBaseUrl.TrimEnd('/')}/auth/setup-account" +
                        $"?email={Uri.EscapeDataString(member.Email)}&token={encodedToken}";

        try
        {
            await emailService.SendAsync(
                to: member.Email,
                subject: "You've been invited to ChurchManager",
                body: $"Hello {member.FirstName},\n\nYou have been invited to access ChurchManager.\n\n" +
                      $"Click the link below to set up your account:\n\n{inviteUrl}\n\n" +
                      $"This link expires in 24 hours.",
                isHtml: false,
                cancellationToken: cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Invite email could not be sent to {Email}. Account was created and linked.", member.Email);
        }
    }
}
