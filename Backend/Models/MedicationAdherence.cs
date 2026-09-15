using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class MedicationAdherence
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string PatientId { get; set; } = null!;

    public string MedicationName { get; set; } = null!;
    public bool Taken { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public VitalSigns? VitalSigns { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class VitalSigns
{
    public string? BloodPressure { get; set; }
    public string? BloodGlucose { get; set; }
    public string? Weight { get; set; }
    public string? HeartRate { get; set; }
    public string? Temperature { get; set; }
}