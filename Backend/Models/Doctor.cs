using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class Doctor
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public string LicenseNumber { get; set; } = null!;
    public string Specialization { get; set; } = null!;
    public string MedicalSchool { get; set; } = null!;
    public int YearsOfExperience { get; set; }
    public List<string> Certifications { get; set; } = new();
    public List<string> Languages { get; set; } = new();
    public string? Biography { get; set; }
    public string? ProfileImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public decimal ConsultationFee { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class DoctorAvailability
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string DoctorId { get; set; } = null!;

    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}