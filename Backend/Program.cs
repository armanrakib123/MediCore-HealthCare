// using HealthCarePlus.API.Services;
// using HealthCarePlus.API.Repositories.Interfaces;
// using HealthCarePlus.API.Repositories;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using BCrypt.Net;
// using MongoDB.Driver;
// using Microsoft.Extensions.Options;
// using HealthCarePlus.API.Models;
// using HealthCarePlus.API.DTOs;

// var builder = WebApplication.CreateBuilder(args);

// // Configuration
// builder.Services.Configure<Microsoft.AspNetCore.Http.HttpContext>(opts => { });

// // MongoDB Configuration
// var mongoConnectionString = builder.Configuration["MongoDbSettings:ConnectionString"] ?? "mongodb://localhost:27017";
// var databaseName = builder.Configuration["MongoDbSettings:DatabaseName"] ?? "healthcareplus";

// builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(mongoConnectionString));
// builder.Services.AddScoped(s => s.GetRequiredService<IMongoClient>().GetDatabase(databaseName));

// // Repositories
// builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
// builder.Services.AddScoped<IPharmacyRepository, PharmacyRepository>();
// builder.Services.AddScoped<IPatientRepository, PatientRepository>();
// builder.Services.AddScoped<IUserRepository, UserRepository>();
// builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();

// // Services
// builder.Services.AddScoped<UserService>();
// builder.Services.AddScoped<DoctorService>();
// builder.Services.AddScoped<PharmacyService>();
// builder.Services.AddScoped<HealthCarePlus.API.Services.PatientService>();
// builder.Services.AddScoped<JwtService>();
// builder.Services.AddScoped<AvatarService>();

// // JWT
// var jwtKey = builder.Configuration["Jwt:Key"] ?? "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET";
// var issuer = builder.Configuration["Jwt:Issuer"] ?? "HealthCarePlus";
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// }).AddJwtBearer(options =>
// {
//     options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidIssuer = issuer,
//         ValidAudience = issuer,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
//         ValidateIssuerSigningKey = true
//     };
// });

// builder.Services.AddAuthorization();
// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // CORS Configuration
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

// var app = builder.Build();

// // Configure the HTTP request pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseCors("AllowAll");
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
// app.MapControllers();

// app.Run();












using HealthCarePlus.API.Services;
using HealthCarePlus.API.Repositories.Interfaces;
using HealthCarePlus.API.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// MongoDB Configuration
// ======================================================

var mongoConnectionString =
    builder.Configuration["MongoDbSettings:ConnectionString"]
    ?? "mongodb://localhost:27017";

var databaseName =
    builder.Configuration["MongoDbSettings:DatabaseName"]
    ?? "healthcareplus";

builder.Services.AddSingleton<IMongoClient>(
    new MongoClient(mongoConnectionString)
);

builder.Services.AddScoped<IMongoDatabase>(serviceProvider =>
{
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    return client.GetDatabase(databaseName);
});


// ======================================================
// Repositories
// ======================================================

builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IPharmacyRepository, PharmacyRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();


// ======================================================
// Services
// ======================================================

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<DoctorService>();
builder.Services.AddScoped<PharmacyService>();
builder.Services.AddScoped<HealthCarePlus.API.Services.PatientService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AvatarService>();


// ======================================================
// JWT Authentication
// ======================================================

var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET";

var issuer =
    builder.Configuration["Jwt:Issuer"]
    ?? "HealthCarePlus";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,

                ValidIssuer = issuer,
                ValidAudience = issuer,

                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ValidateLifetime = true
            };
    });

builder.Services.AddAuthorization();


// ======================================================
// Controllers
// ======================================================

builder.Services.AddControllers();


// ======================================================
// Swagger
// ======================================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ======================================================
// CORS
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();


// ======================================================
// Swagger
// ======================================================

// Development check-এর বাইরে রেখেছি,
// তাই সব environment-এ Swagger available থাকবে.

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "HealthCarePlus API v1"
    );

    options.RoutePrefix = "swagger";
});


// ======================================================
// Middleware
// ======================================================

app.UseCors("AllowAll");

app.UseAuthentication();

app.UseAuthorization();


// ======================================================
// Health Check
// ======================================================

app.MapGet(
    "/health",
    () => Results.Ok(new
    {
        status = "ok",
        message = "HealthCarePlus API is running"
    })
);


// ======================================================
// Controllers
// ======================================================

app.MapControllers();


// ======================================================
// Run
// ======================================================

app.Run();