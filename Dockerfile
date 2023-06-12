FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN apk add nodejs
RUN apk add npm
WORKDIR /app
COPY . ./
RUN npm --prefix Web install
RUN dotnet publish "Web/BlazorApp.Server.csproj" -c Release -o output

FROM nginx:alpine
WORKDIR /user/share/nginx/html
COPY --from=build /app/output/wwwroot .
COPY Web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

#FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
#WORKDIR /app
#EXPOSE 80
#
#FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
#WORKDIR /src
#COPY ["Server/BlazorApp.Server.csproj", "Server/"]
#COPY ["Client/BlazorApp.Client.csproj", "Client/"]
#COPY ["Shared/BlazorApp.Shared.csproj", "Shared/"]
#RUN dotnet restore "Server/BlazorApp.Server.csproj"
#COPY . .
#WORKDIR "/src/Server"
#RUN dotnet build "BlazorApp.Server.csproj" -c Release -o /app/build
#
#FROM build AS publish
#RUN dotnet publish "BlazorApp.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false
#
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "BlazorApp.Server.dll"]
