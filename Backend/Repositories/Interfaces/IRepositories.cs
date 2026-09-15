using HealthCarePlus.API.Models;

namespace HealthCarePlus.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(string id);
    Task<string?> CreateAsync(User user);
    Task<bool> UpdateAsync(string id, User user);
    Task<List<User>> GetAllByRoleAsync(string role);
}

public interface IPatientRepository
{
    Task<Patient?> GetByUserIdAsync(string userId);
    Task<Patient?> GetByIdAsync(string id);
    Task<Patient?> GetByMedicalRecordNumberAsync(string medicalRecordNumber);
    Task<List<Patient>> GetByBloodTypeAsync(string bloodType);
    Task<string?> CreateAsync(Patient patient);
    Task<bool> UpdateAsync(string id, Patient patient);
    Task<bool> UpdateMedicalInfoAsync(string id, List<string> allergies, List<string> chronicConditions);
    Task<bool> DeleteAsync(string id);
    Task<List<Patient>> GetAllAsync();
    Task<EmergencyContact?> GetEmergencyContactAsync(string patientId);
    Task<InsuranceInfo?> GetInsuranceInfoAsync(string patientId);
}



public interface IPharmacyRepository
{
    Task<Pharmacy?> GetByUserIdAsync(string userId);
    Task<Pharmacy?> GetByIdAsync(string id);
    Task<Pharmacy?> GetByLicenseNumberAsync(string licenseNumber);
    Task<string?> CreateAsync(Pharmacy pharmacy);
    Task<bool> UpdateAsync(string id, Pharmacy pharmacy);
    Task<bool> UpdateAvailabilityAsync(string id, bool isActive);
    Task<bool> DeleteAsync(string id);
    Task<List<Pharmacy>> GetAllAsync();
    Task<List<Pharmacy>> GetByCityAsync(string city);
    Task<List<Pharmacy>> GetActivePharmaciesAsync();
}

public interface IPrescriptionRepository
{
    Task<Prescription?> GetByIdAsync(string id);
    Task<List<Prescription>> GetByDoctorIdAsync(string doctorId);
    Task<List<Prescription>> GetByPatientIdAsync(string patientId);
    Task<List<Prescription>> GetByStatusAsync(string status);
    Task<string?> CreateAsync(Prescription prescription);
    Task<bool> UpdateAsync(string id, Prescription prescription);
    Task<bool> DeleteAsync(string id);
}

public interface IMedicationAdherenceRepository
{
    Task<MedicationAdherence?> GetByIdAsync(string id);
    Task<List<MedicationAdherence>> GetByPatientIdAsync(string patientId);
    Task<List<MedicationAdherence>> GetByPrescriptionIdAsync(string prescriptionId);
    Task<string?> CreateAsync(MedicationAdherence adherence);
    Task<bool> UpdateAsync(string id, MedicationAdherence adherence);
}

public interface IAuditLogRepository
{
    Task<string?> CreateAsync(AuditLog auditLog);
    Task<List<AuditLog>> GetByUserIdAsync(string userId);
    Task<List<AuditLog>> GetByResourceAsync(string resource, string resourceId);
}

public interface IDispenseRecordRepository
{
    Task<DispenseRecord?> GetByIdAsync(string id);
    Task<List<DispenseRecord>> GetByPharmacyIdAsync(string pharmacyId);
    Task<List<DispenseRecord>> GetByPrescriptionIdAsync(string prescriptionId);
    Task<string?> CreateAsync(DispenseRecord record);
    Task<bool> UpdateAsync(string id, DispenseRecord record);
}