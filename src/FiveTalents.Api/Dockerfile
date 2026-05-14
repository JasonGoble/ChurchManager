FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/FiveTalents.Api/FiveTalents.Api.csproj", "src/FiveTalents.Api/"]
COPY ["src/FiveTalents.Application/FiveTalents.Application.csproj", "src/FiveTalents.Application/"]
COPY ["src/FiveTalents.Domain/FiveTalents.Domain.csproj", "src/FiveTalents.Domain/"]
COPY ["src/FiveTalents.Infrastructure/FiveTalents.Infrastructure.csproj", "src/FiveTalents.Infrastructure/"]
RUN dotnet restore "src/FiveTalents.Api/FiveTalents.Api.csproj"
COPY . .
WORKDIR "/src/src/FiveTalents.Api"
RUN dotnet build "FiveTalents.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FiveTalents.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FiveTalents.Api.dll"]
