using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class Appointment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string PatientId { get; set; } = null!;
    
    public string PatientName { get; set; } = null!;
    public string PatientEmail { get; set; } = null!;

    public string? DoctorId { get; set; }
    
    public string DoctorName { get; set; } = null!;
    public string DoctorSpecialty { get; set; } = null!;

    public DateTime AppointmentDate { get; set; }
    public string TimeSlot { get; set; } = null!; // e.g., "10:00 AM"
    
    public string Reason { get; set; } = null!;
    public string? Notes { get; set; }
    
    // Status: pending, confirmed, completed, cancelled
    public string Status { get; set; } = "pending";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
