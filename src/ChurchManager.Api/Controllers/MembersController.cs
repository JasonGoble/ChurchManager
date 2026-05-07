using ChurchManager.Application.Members.Commands;
using ChurchManager.Application.Members.Queries;
using ChurchManager.Domain.Members;
using Microsoft.AspNetCore.Mvc;

namespace ChurchManager.Api.Controllers;

public class MembersController : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(int organizationId, int page = 1, int pageSize = 25, string? search = null, MemberStatus? status = null, CancellationToken ct = default)
        => Ok(await Mediator.Send(new GetMembersQuery(organizationId, page, pageSize, search, status), ct));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct = default)
        => Ok(await Mediator.Send(new GetMemberByIdQuery(id), ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMemberCommand command, CancellationToken ct = default)
    {
        var id = await Mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMemberCommand command, CancellationToken ct = default)
    {
        if (id != command.Id) return BadRequest();
        await Mediator.Send(command, ct);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        await Mediator.Send(new DeleteMemberCommand(id), ct);
        return NoContent();
    }
}
