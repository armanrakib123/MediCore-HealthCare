using MediCore.API.Services;
using MediCore.API.Repositories.Interfaces;
using MediCore.API.Repositories;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using MongoDB.Bson;
using MongoDB.Driver;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// Frontend URL Configuration
// ======================================================

var clientUrl =
    Environment.GetEnvironmentVariable("BaseUrl")
    ?? "https://medicore-healthcare-seven.vercel.app";

Console.WriteLine();
Console.WriteLine("======================================================");
Console.WriteLine($"🌐 Frontend URL: {clientUrl}");
Console.WriteLine("======================================================");


// ======================================================
// MongoDB Configuration
// ======================================================

var mongoConnectionString =
    builder.Configuration["MongoDbSettings:ConnectionString"];

var databaseName =
    builder.Configuration["MongoDbSettings:DatabaseName"];

if (string.IsNullOrWhiteSpace(mongoConnectionString))
{
    throw new InvalidOperationException(
        "MongoDB connection string is not configured. " +
        "Set 'MongoDbSettings:ConnectionString' in User Secrets or configuration."
    );
}

if (string.IsNullOrWhiteSpace(databaseName))
{
    throw new InvalidOperationException(
        "MongoDB database name is not configured. " +
        "Set 'MongoDbSettings:DatabaseName' in User Secrets or configuration."
    );
}


// ======================================================
// MongoDB Registration
// ======================================================

builder.Services.AddSingleton<IMongoClient>(
    new MongoClient(mongoConnectionString)
);

builder.Services.AddScoped<IMongoDatabase>(serviceProvider =>
{
    var client =
        serviceProvider.GetRequiredService<IMongoClient>();

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
// Application Services
// ======================================================

builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<DoctorService>();

builder.Services.AddScoped<PharmacyService>();

builder.Services.AddScoped<
    MediCore.API.Services.PatientService
>();

builder.Services.AddScoped<JwtService>();

builder.Services.AddScoped<AvatarService>();


// ======================================================
// Seed Data Service
// ======================================================

builder.Services.AddScoped<SeedDataService>();


// ======================================================
// JWT Authentication
// ======================================================

var jwtKey =
    builder.Configuration["Jwt:Key"];

var issuer =
    builder.Configuration["Jwt:Issuer"]
    ?? "MediCore";

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT secret key is not configured. " +
        "Set 'Jwt:Key' in User Secrets or environment variables."
    );
}

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
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

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
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
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(clientUrl, "https://medicore-healthcare-seven.vercel.app", "http://127.0.0.1:5173", "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});


// ======================================================
// Build Application
// ======================================================

var app = builder.Build();


// ======================================================
// MongoDB Connection Test
// ======================================================

try
{
    var mongoClient =
        app.Services.GetRequiredService<IMongoClient>();

    var mongoDatabase =
        mongoClient.GetDatabase(databaseName);

    await mongoDatabase.RunCommandAsync<BsonDocument>(
        new BsonDocument("ping", 1)
    );

    Console.WriteLine();
    Console.WriteLine(
        "======================================================"
    );

    Console.WriteLine(
        "✅ MongoDB connected successfully!"
    );

    Console.WriteLine(
        $"📦 Database: {databaseName}"
    );

    Console.WriteLine(
        "======================================================"
    );
}
catch (Exception ex)
{
    Console.WriteLine();
    Console.WriteLine(
        "======================================================"
    );

    Console.WriteLine(
        "❌ MongoDB connection failed!"
    );

    Console.WriteLine(
        $"Error: {ex.Message}"
    );

    Console.WriteLine(
        "======================================================"
    );

    throw;
}


// ======================================================
// Seed MongoDB Database
// ======================================================

try
{
    Console.WriteLine();
    Console.WriteLine(
        "======================================================"
    );

    Console.WriteLine(
        "🌱 Initializing MongoDB seed data..."
    );

    Console.WriteLine(
        "======================================================"
    );

    using (var scope = app.Services.CreateScope())
    {
        var seedDataService =
            scope.ServiceProvider
                .GetRequiredService<SeedDataService>();

        await seedDataService.SeedDataAsync();
    }
}
catch (Exception ex)
{
    Console.WriteLine();
    Console.WriteLine(
        "======================================================"
    );

    Console.WriteLine(
        "❌ MongoDB seeding failed!"
    );

    Console.WriteLine(
        $"Error: {ex.Message}"
    );

    Console.WriteLine(
        "======================================================"
    );

    throw;
}


// ======================================================
// Swagger
// ======================================================

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "MediCore API v1"
    );

    options.RoutePrefix = "swagger";
});


// ======================================================
// Middleware
// ======================================================

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();


// ======================================================
// Health Check
// ======================================================

app.MapGet(
    "/health",
    async (IMongoClient mongoClient) =>
    {
        try
        {
            await mongoClient
                .GetDatabase(databaseName)
                .RunCommandAsync<BsonDocument>(
                    new BsonDocument("ping", 1)
                );

            return Results.Ok(
                new
                {
                    status = "ok",

                    api = "running",

                    mongodb = "connected",

                    database = databaseName,

                    frontend = clientUrl
                }
            );
        }
        catch
        {
            return Results.Json(
                new
                {
                    status = "error",

                    api = "running",

                    mongodb = "disconnected"
                },
                statusCode:
                    StatusCodes.Status503ServiceUnavailable
            );
        }
    }
);


// ======================================================
// Controllers
// ======================================================

app.MapControllers();


// ======================================================
// Run Application
// ======================================================

Console.WriteLine();
Console.WriteLine(
    "======================================================"
);

Console.WriteLine(
    "🚀 MediCore API is starting..."
);

Console.WriteLine(
    "🌐 API: http://localhost:5000"
);

Console.WriteLine(
    "📘 Swagger: http://localhost:5000/swagger"
);

Console.WriteLine(
    "❤️ Health: http://localhost:5000/health"
);

Console.WriteLine(
    "======================================================"
);

app.Run();