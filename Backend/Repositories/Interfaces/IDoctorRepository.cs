using HealthCarePlus.API.Models;

namespace HealthCarePlus.API.Repositories.Interfaces;

public interface IDoctorRepository
{
    Task<string?> CreateAsync(Doctor doctor);
    Task<Doctor?> GetByIdAsync(string id);
    Task<Doctor?> GetByUserIdAsync(string userId);
    Task<Doctor?> GetByLicenseNumberAsync(string licenseNumber);
    Task<List<Doctor>> GetAllAsync();
    Task<bool> UpdateAsync(string id, Doctor doctor);
    Task<bool> DeleteAsync(string id);
    Task<List<Doctor>> GetBySpecializationAsync(string specialization);
    Task<List<Doctor>> GetAvailableDoctorsAsync();
}