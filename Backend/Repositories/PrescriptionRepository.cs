using MongoDB.Driver;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;

namespace HealthCarePlus.API.Repositories;

public class PrescriptionRepository : BaseRepository<Prescription>, IPrescriptionRepository
{
    public PrescriptionRepository(IMongoDatabase database) : base(database, "prescriptions") { }

    public async Task<List<Prescription>> GetByDoctorIdAsync(string doctorId)
    {
        return await _collection.Find(p => p.DoctorId == doctorId)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Prescription>> GetByPatientIdAsync(string patientId)
    {
        return await _collection.Find(p => p.PatientId == patientId)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Prescription>> GetByStatusAsync(string status)
    {
        return await _collection.Find(p => p.Status == status)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public override async Task<string?> CreateAsync(Prescription prescription)
    {
        try
        {
            await _collection.InsertOneAsync(prescription);
            return prescription.Id;
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> UpdateStatusAsync(string id, string status, string? notes = null)
    {
        try
        {
            var update = Builders<Prescription>.Update
                .Set(p => p.Status, status)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            if (!string.IsNullOrEmpty(notes))
            {
                update = update.Set(p => p.Notes, notes);
            }

            var result = await _collection.UpdateOneAsync(
                Builders<Prescription>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(id)),
                update);

            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
        catch
        {
            return false;
        }
    }
}