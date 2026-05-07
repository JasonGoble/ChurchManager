using ChurchManager.Application.Common.Exceptions;
using ChurchManager.Application.Common.Interfaces;
using ChurchManager.Domain.Members;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Members.Commands;

public record MoveMemberToOrganizationCommand(int MemberId, int OrganizationId) : IRequest;

public class MoveMemberToOrganizationCommandHandler(IApplicationDbContext db)
    : IRequestHandler<MoveMemberToOrganizationCommand>
{
    public async Task Handle(MoveMemberToOrganizationCommand request, CancellationToken cancellationToken)
    {
        var member = await db.Members.FirstOrDefaultAsync(m => m.Id == request.MemberId && !m.IsDeleted, cancellationToken)
            ?? throw new NotFoundException(nameof(Member), request.MemberId);

        var orgExists = await db.Organizations.AnyAsync(o => o.Id == request.OrganizationId && o.IsActive && !o.IsDeleted, cancellationToken);
        if (!orgExists)
            throw new NotFoundException("Organization", request.OrganizationId);

        member.OrganizationId = request.OrganizationId;
        member.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }
}
