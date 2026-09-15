using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;
using HealthCarePlus.API.DTOs;

namespace HealthCarePlus.API.Services;

public class DoctorService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly UserService _userService;

    public DoctorService(IDoctorRepository doctorRepository, UserService userService)
    {
        _doctorRepository = doctorRepository;
        _userService = userService;
    }

    public async Task<string?> RegisterDoctorAsync(DoctorRegisterDto dto)
    {
        // Check if username or email already exists
        if (await _userService.GetByUsernameAsync(dto.Username) != null)
            return null; // Username already taken

        if (await _userService.GetByEmailAsync(dto.Email) != null)
            return null; // Email already registered

        // Check if license number already exists
        if (await _doctorRepository.GetByLicenseNumberAsync(dto.LicenseNumber) != null)
            return null; // License number already exists

        // Create user first
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Doctor",
            FirstName = dto.FirstName ?? dto.Username, // Fallback to username
            LastName = dto.LastName ?? "",
            Phone = dto.Phone,
            DateOfBirth = dto.DateOfBirth,
            LicenseNumber = dto.LicenseNumber
        };

        var userId = await _userService.CreateAsync(user);
        if (userId == null)
        {
            Console.WriteLine("Failed to create user for doctor registration");
            return null; // Failed to create user
        }

        // Create doctor record
        var doctor = new Doctor
        {
            UserId = userId,
            LicenseNumber = dto.LicenseNumber,
            Specialization = dto.Specialization,
            MedicalSchool = dto.MedicalSchool,
            YearsOfExperience = dto.YearsOfExperience,
            Certifications = dto.Certifications ?? new List<string>(),
            Languages = dto.Languages ?? new List<string>(),
            Biography = dto.Biography,
            ConsultationFee = dto.ConsultationFee,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return await _doctorRepository.CreateAsync(doctor);
    }

    public async Task<Doctor?> GetDoctorByUserIdAsync(string userId)
    {
        return await _doctorRepository.GetByUserIdAsync(userId);
    }

    public async Task<Doctor?> GetDoctorByIdAsync(string doctorId)
    {
        return await _doctorRepository.GetByIdAsync(doctorId);
    }

    public async Task<Doctor?> GetDoctorByLicenseNumberAsync(string licenseNumber)
    {
        return await _doctorRepository.GetByLicenseNumberAsync(licenseNumber);
    }

    public async Task<List<Doctor>> GetAllDoctorsAsync()
    {
        return await _doctorRepository.GetAllAsync();
    }

    public async Task<List<Doctor>> GetDoctorsBySpecializationAsync(string specialization)
    {
        return await _doctorRepository.GetBySpecializationAsync(specialization);
    }

    public async Task<List<Doctor>> GetAvailableDoctorsAsync()
    {
        return await _doctorRepository.GetAvailableDoctorsAsync();
    }

    public async Task<bool> UpdateDoctorAsync(string doctorId, Doctor doctor)
    {
        return await _doctorRepository.UpdateAsync(doctorId, doctor);
    }

    public async Task<bool> DeleteDoctorAsync(string doctorId)
    {
        var doctor = await _doctorRepository.GetByIdAsync(doctorId);
        if (doctor == null) return false;

        // Delete associated user
        await _userService.DeleteAsync(doctor.UserId);

        // Delete doctor record
        return await _doctorRepository.DeleteAsync(doctorId);
    }
}