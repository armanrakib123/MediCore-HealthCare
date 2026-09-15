using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class AuditLog
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public string Action { get; set; } = null!;
    public string Resource { get; set; } = null!;
    public string ResourceId { get; set; } = null!;
    public object Details { get; set; } = new();
    public string IpAddress { get; set; } = null!;
    public string UserAgent { get; set; } = null!;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}