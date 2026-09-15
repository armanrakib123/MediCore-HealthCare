using MongoDB.Driver;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;

namespace HealthCarePlus.API.Repositories;

public class PharmacyRepository : BaseRepository<Pharmacy>, IPharmacyRepository
{
    public PharmacyRepository(IMongoDatabase database) : base(database, "pharmacies")
    {
    }

    public override async Task<string?> CreateAsync(Pharmacy pharmacy)
    {
        try
        {
            await _collection.InsertOneAsync(pharmacy);
            return pharmacy.Id;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<Pharmacy?> GetByUserIdAsync(string userId)
    {
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.UserId, userId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<Pharmacy?> GetByLicenseNumberAsync(string licenseNumber)
    {
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.LicenseNumber, licenseNumber);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Pharmacy>> GetByCityAsync(string city)
    {
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.City, city);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<List<Pharmacy>> GetActivePharmaciesAsync()
    {
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.IsActive, true);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<bool> UpdateAvailabilityAsync(string id, bool isActive)
    {
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.Id, id);
        var update = Builders<Pharmacy>.Update
            .Set(p => p.IsActive, isActive)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);
        
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public override async Task<bool> UpdateAsync(string id, Pharmacy pharmacy)
    {
        pharmacy.UpdatedAt = DateTime.UtcNow;
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.Id, id);
        var result = await _collection.ReplaceOneAsync(filter, pharmacy);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public override async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Pharmacy>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}