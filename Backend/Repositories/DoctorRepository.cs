using MongoDB.Driver;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;

namespace HealthCarePlus.API.Repositories;

public class DoctorRepository : BaseRepository<Doctor>, IDoctorRepository
{
    public DoctorRepository(IMongoDatabase database) : base(database, "doctors")
    {
    }

    public override async Task<string?> CreateAsync(Doctor doctor)
    {
        try
        {
            await _collection.InsertOneAsync(doctor);
            return doctor.Id;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<Doctor?> GetByUserIdAsync(string userId)
    {
        var filter = Builders<Doctor>.Filter.Eq(d => d.UserId, userId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<Doctor?> GetByLicenseNumberAsync(string licenseNumber)
    {
        var filter = Builders<Doctor>.Filter.Eq(d => d.LicenseNumber, licenseNumber);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Doctor>> GetBySpecializationAsync(string specialization)
    {
        var filter = Builders<Doctor>.Filter.Eq(d => d.Specialization, specialization);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<List<Doctor>> GetAvailableDoctorsAsync()
    {
        var filter = Builders<Doctor>.Filter.Eq(d => d.IsAvailable, true);
        return await _collection.Find(filter).ToListAsync();
    }

    public override async Task<bool> UpdateAsync(string id, Doctor doctor)
    {
        doctor.UpdatedAt = DateTime.UtcNow;
        var filter = Builders<Doctor>.Filter.Eq(d => d.Id, id);
        var result = await _collection.ReplaceOneAsync(filter, doctor);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public override async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Doctor>.Filter.Eq(d => d.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}