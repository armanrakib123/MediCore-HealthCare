using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "Patient"; // Admin, Doctor, Pharmacist, Patient
    
    // Profile Information
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    
    // Professional Information (for Doctors/Pharmacists)
    public string? LicenseNumber { get; set; }
    
    // Account Status
    public bool IsActive { get; set; } = true;
    
    // Password Reset Fields
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiry { get; set; }

    // Social Login Fields
    public string? OAuthProvider { get; set; }
    public string? OAuthProviderId { get; set; }
    
    // Avatar Information
    public string? AvatarColor { get; set; }
    public string? AvatarEmoji { get; set; }
    public string? ProfileImageUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}
