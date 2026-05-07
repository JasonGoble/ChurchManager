using ChurchManager.Application.Common.Exceptions;
using ChurchManager.Application.Common.Interfaces;
using ChurchManager.Domain.Members;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchManager.Application.Members.Commands;

public record UpdateMemberCommand(
    int Id,
    string FirstName,
    string LastName,
    string? Email,
    string? PhoneNumber,
    DateTime? DateOfBirth,
    Gender? Gender,
    MaritalStatus? MaritalStatus,
    MemberStatus Status,
    string? Address,
    string? City,
    string? State,
    string? PostalCode,
    string? Country,
    string? Notes
) : IRequest;

public class UpdateMemberCommandHandler(IApplicationDbContext db) : IRequestHandler<UpdateMemberCommand>
{
    public async Task Handle(UpdateMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await db.Members.FirstOrDefaultAsync(m => m.Id == request.Id && !m.IsDeleted, cancellationToken)
            ?? throw new NotFoundException(nameof(Member), request.Id);

        member.FirstName = request.FirstName;
        member.LastName = request.LastName;
        member.Email = request.Email;
        member.PhoneNumber = request.PhoneNumber;
        member.DateOfBirth = request.DateOfBirth;
        member.Gender = request.Gender;
        member.MaritalStatus = request.MaritalStatus;
        member.Status = request.Status;
        member.Address = request.Address;
        member.City = request.City;
        member.State = request.State;
        member.PostalCode = request.PostalCode;
        member.Country = request.Country;
        member.Notes = request.Notes;
        member.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);
    }
}
