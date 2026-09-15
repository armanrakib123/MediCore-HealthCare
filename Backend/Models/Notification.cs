using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class Notification
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public string Type { get; set; } = "Info"; // Reminder, Alert, Prescription, System
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public bool IsRead { get; set; } = false;
    public string? ActionUrl { get; set; }
    public string Priority { get; set; } = "Medium"; // Low, Medium, High
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
}