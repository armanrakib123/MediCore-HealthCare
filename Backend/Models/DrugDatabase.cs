using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthCarePlus.API.Models;

public class DrugDatabase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public string DrugName { get; set; } = null!;
    public string GenericName { get; set; } = null!;
    public List<string> BrandNames { get; set; } = new();
    public string Category { get; set; } = null!;
    public List<string> DosageForms { get; set; } = new();
    public List<string> Strengths { get; set; } = new();
    public List<string> Indications { get; set; } = new();
    public List<string> Contraindications { get; set; } = new();
    public List<string> SideEffects { get; set; } = new();
    public List<DrugInteraction> Interactions { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class DrugInteraction
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string DrugId { get; set; } = null!;
    public string Severity { get; set; } = "Mild"; // Mild, Moderate, Severe
    public string Description { get; set; } = null!;
}