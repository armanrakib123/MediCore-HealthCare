using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class Pharmacy
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public string PharmacyName { get; set; } = null!;
    public string LicenseNumber { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string City { get; set; } = null!;
    public string State { get; set; } = null!;
    public string ZipCode { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public List<string> OperatingHours { get; set; } = new();
    public bool IsOpen24Hours { get; set; } = false;
    public List<string> Services { get; set; } = new();
    public decimal DeliveryFee { get; set; }
    public bool OffersDelivery { get; set; } = false;
    public string? ProfileImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class DispenseRecord
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string PrescriptionId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string PharmacyId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string PharmacistId { get; set; } = null!;

    public string Status { get; set; } = "Pending"; // Pending, Dispensed, Rejected
    public DateTime DispensedAt { get; set; }
    public string? RejectionReason { get; set; }
    public string? Notes { get; set; }
    public List<DispensedMedication> DispensedMedications { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class DispensedMedication
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string MedicationId { get; set; } = null!;
    public string DrugName { get; set; } = null!;
    public int QuantityDispensed { get; set; }
    public string Dosage { get; set; } = null!;
    public string Instructions { get; set; } = null!;
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}