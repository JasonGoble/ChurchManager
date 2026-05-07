FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/ChurchManager.Api/ChurchManager.Api.csproj", "src/ChurchManager.Api/"]
COPY ["src/ChurchManager.Application/ChurchManager.Application.csproj", "src/ChurchManager.Application/"]
COPY ["src/ChurchManager.Domain/ChurchManager.Domain.csproj", "src/ChurchManager.Domain/"]
COPY ["src/ChurchManager.Infrastructure/ChurchManager.Infrastructure.csproj", "src/ChurchManager.Infrastructure/"]
RUN dotnet restore "src/ChurchManager.Api/ChurchManager.Api.csproj"
COPY . .
WORKDIR "/src/src/ChurchManager.Api"
RUN dotnet build "ChurchManager.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ChurchManager.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ChurchManager.Api.dll"]
