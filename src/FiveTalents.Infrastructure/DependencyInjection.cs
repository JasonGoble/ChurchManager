using FiveTalents.Application.Common.Interfaces;
using FiveTalents.Infrastructure.Identity;
using FiveTalents.Infrastructure.Persistence;
using FiveTalents.Infrastructure.Services;
using FiveTalents.Infrastructure.Services.Email;
using FiveTalents.Infrastructure.Services.GoogleWorkspace;
using FiveTalents.Infrastructure.Services.Sms;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FiveTalents.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IOrganizationHierarchyService, OrganizationHierarchyService>();
        services.AddScoped<IUserLinkingService, UserLinkingService>();
        services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<ISmsService, SmsService>();
        services.AddScoped<IGoogleWorkspaceService, GoogleWorkspaceService>();

        return services;
    }
}
