using ChurchManager.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChurchManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive || !await userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized(new { message = "Invalid credentials" });

        var token = GenerateJwtToken(user);
        user.LastLoginAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        return Ok(new { token, user = new { user.Id, user.Email, user.FullName, user.PrimaryOrganizationId } });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        return Ok(new { message = "Registration successful" });
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        return Ok(new { message = "Password changed successfully" });
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Email, user.Email!),
            new("full_name", user.FullName),
        };

        if (user.PrimaryOrganizationId.HasValue)
            claims.Add(new("organization_id", user.PrimaryOrganizationId.Value.ToString()));

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpiryHours"] ?? "24")),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string FirstName, string LastName, string Email, string Password);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
