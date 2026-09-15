using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class Patient
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public string MedicalRecordNumber { get; set; } = null!;
    public string BloodType { get; set; } = null!;
    public List<string> Allergies { get; set; } = new();
    public List<string> ChronicConditions { get; set; } = new();
    
    public EmergencyContact EmergencyContact { get; set; } = new();
    public InsuranceInfo InsuranceInfo { get; set; } = new();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class EmergencyContact
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Relationship { get; set; } = null!;
}

public class InsuranceInfo
{
    public string Provider { get; set; } = null!;
    public string PolicyNumber { get; set; } = null!;
    public string GroupNumber { get; set; } = null!;
}