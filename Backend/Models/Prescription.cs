using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class Prescription
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string PrescriptionNumber { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? DoctorId { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string PatientId { get; set; } = null!;

    public List<Medication> Medications { get; set; } = new();
    public string? Diagnosis { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Dispensed, Cancelled
    public string? DigitalSignature { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
    public string? Notes { get; set; }
    
    // New fields for uploaded prescriptions
    [BsonIgnoreIfNull]
    public string? ImageData { get; set; } // Base64 encoded image data
    
    [BsonIgnoreIfNull]
    public string? ImageFileName { get; set; }
    
    [BsonIgnoreIfNull]
    public string? UploadedFileName { get; set; } // For backward compatibility
    
    public int? PharmacyId { get; set; }
    
    [BsonIgnoreIfNull]
    public string? PharmacyName { get; set; }
    
    public string PrescriptionSource { get; set; } = "Uploaded"; // Uploaded or Generated
}

public class Medication
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string? DrugId { get; set; }
    public string DrugName { get; set; } = null!;
    public string Dosage { get; set; } = null!;
    public string Frequency { get; set; } = null!;
    public string Duration { get; set; } = null!;
    public int Quantity { get; set; }
    public int RefillsAllowed { get; set; }
    public string Instructions { get; set; } = null!;
}