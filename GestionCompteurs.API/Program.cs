using System.Text;
using GestionCompteurs.Application.Interfaces;
using GestionCompteurs.Application.Services;
using GestionCompteurs.Application.Validators;
using GestionCompteurs.Domain.Entities;
using GestionCompteurs.Domain.Enums;
using GestionCompteurs.Infrastructure.Data;
using GestionCompteurs.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Ajout des services au conteneur
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configuration CORS pour autoriser le frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var allowedOrigin = builder.Configuration["AllowedOrigin"] ?? "http://localhost:3000";
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configuration Swagger avec JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "GestionCompteurs.API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
});

// Enregistrement du DbContext avec SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Enregistrement des repositories et services (via leurs interfaces — principe DIP)
builder.Services.AddScoped<IAgenceRepository, AgenceRepository>();
builder.Services.AddScoped<IAgenceService, AgenceService>();
builder.Services.AddScoped<ITourneeRepository, TourneeRepository>();
builder.Services.AddScoped<ITourneeService, TourneeService>();
builder.Services.AddScoped<IAbonneRepository, AbonneRepository>();
builder.Services.AddScoped<IAbonneService, AbonneService>();
builder.Services.AddScoped<IAbonnementRepository, AbonnementRepository>();
builder.Services.AddScoped<IAbonnementService, AbonnementService>();
builder.Services.AddScoped<IEtudeRepository, EtudeRepository>();
builder.Services.AddScoped<IEtudeService, EtudeService>();
builder.Services.AddScoped<EtudeValidator>();
builder.Services.AddScoped<IMouvementCompteurRepository, MouvementCompteurRepository>();
builder.Services.AddScoped<IMouvementCompteurService, MouvementCompteurService>();
builder.Services.AddScoped<IUtilisateurRepository, UtilisateurRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Configuration JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "SuperSecretKeyWhichIsLongEnoughForHmacSha256!!!");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

var app = builder.Build();

// =========================================================
// Initialisation des comptes utilisateurs par défaut
// Exécuté une seule fois — ignoré si les comptes existent déjà
// =========================================================
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var comptesParDefaut = new[]
    {
        new { Login = "admin",        Password = "Admin123!",  Role = RoleUtilisateur.Administration },
        new { Login = "consultation", Password = "Consul123!", Role = RoleUtilisateur.Consultation  }
    };

    foreach (var compte in comptesParDefaut)
    {
        var utilisateur = context.Utilisateurs.FirstOrDefault(u => u.Login == compte.Login);
        if (utilisateur is null)
        {
            // Compte inexistant → création
            context.Utilisateurs.Add(new Utilisateur
            {
                Login        = compte.Login,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(compte.Password),
                Role         = compte.Role
            });
        }
        else
        {
            // Compte existant → réinitialisation du mot de passe par défaut
            utilisateur.PasswordHash = BCrypt.Net.BCrypt.HashPassword(compte.Password);
            utilisateur.Role         = compte.Role;
        }
    }

    context.SaveChanges();
}

// Configuration du pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();