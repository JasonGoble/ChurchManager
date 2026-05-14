using FiveTalents.Application.Common.Interfaces;
using FiveTalents.Domain.Members;
using MediatR;

namespace FiveTalents.Application.Members.Commands;

public record CreateMemberCommand(
    int OrganizationId,
    string FirstName,
    string LastName,
    string? Email,
    string? PhoneNumber,
    DateTime? DateOfBirth,
    Gender? Gender,
    MaritalStatus? MaritalStatus,
    DateTime? JoinDate,
    string? Address,
    string? City,
    string? State,
    string? PostalCode,
    string? Country
) : IRequest<int>;

public class CreateMemberCommandHandler(IApplicationDbContext db) : IRequestHandler<CreateMemberCommand, int>
{
    public async Task<int> Handle(CreateMemberCommand request, CancellationToken cancellationToken)
    {
        var member = new Member
        {
            OrganizationId = request.OrganizationId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            MaritalStatus = request.MaritalStatus,
            JoinDate = request.JoinDate ?? DateTime.UtcNow,
            Address = request.Address,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            Country = request.Country,
            Status = MemberStatus.Active
        };

        db.Members.Add(member);
        await db.SaveChangesAsync(cancellationToken);
        return member.Id;
    }
}
