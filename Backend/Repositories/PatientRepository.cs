using MongoDB.Driver;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;

namespace HealthCarePlus.API.Repositories;

public class PatientRepository : BaseRepository<Patient>, IPatientRepository
{
    public PatientRepository(IMongoDatabase database) : base(database, "patients")
    {
    }

    public override async Task<string?> CreateAsync(Patient patient)
    {
        try
        {
            await _collection.InsertOneAsync(patient);
            return patient.Id;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<Patient?> GetByUserIdAsync(string userId)
    {
        var filter = Builders<Patient>.Filter.Eq(p => p.UserId, userId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<Patient?> GetByMedicalRecordNumberAsync(string medicalRecordNumber)
    {
        var filter = Builders<Patient>.Filter.Eq(p => p.MedicalRecordNumber, medicalRecordNumber);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Patient>> GetByBloodTypeAsync(string bloodType)
    {
        var filter = Builders<Patient>.Filter.Eq(p => p.BloodType, bloodType);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<bool> UpdateMedicalInfoAsync(string id, List<string> allergies, List<string> chronicConditions)
    {
        var filter = Builders<Patient>.Filter.Eq(p => p.Id, id);
        var update = Builders<Patient>.Update
            .Set(p => p.Allergies, allergies)
            .Set(p => p.ChronicConditions, chronicConditions)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);
        
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<EmergencyContact?> GetEmergencyContactAsync(string patientId)
    {
        var patient = await GetByIdAsync(patientId);
        return patient?.EmergencyContact;
    }

    public async Task<InsuranceInfo?> GetInsuranceInfoAsync(string patientId)
    {
        var patient = await GetByIdAsync(patientId);
        return patient?.InsuranceInfo;
    }

    public override async Task<bool> UpdateAsync(string id, Patient patient)
    {
        patient.UpdatedAt = DateTime.UtcNow;
        var filter = Builders<Patient>.Filter.Eq(p => p.Id, id);
        var result = await _collection.ReplaceOneAsync(filter, patient);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public override async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Patient>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}