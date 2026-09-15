using HealthCarePlus.API.DTOs;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;
using MongoDB.Bson;

namespace HealthCarePlus.API.Services;

public class PatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly AvatarService _avatarService;

    public PatientService(IPatientRepository patientRepository, IUserRepository userRepository, IPrescriptionRepository prescriptionRepository, AvatarService avatarService)
    {
        _patientRepository = patientRepository;
        _userRepository = userRepository;
        _prescriptionRepository = prescriptionRepository;
        _avatarService = avatarService;
    }

    public async Task<string?> RegisterPatientAsync(PatientRegisterDto dto)
    {
        // Check if username or email already exists
        var existingUser = await _userRepository.GetByUsernameAsync(dto.Username) ?? await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            return null;

        // Generate unique medical record number
        var medicalRecordNumber = $"MRN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";

        // Generate avatar
        var (color, emoji) = _avatarService.GenerateAvatar(dto.Username);
        var avatarUrl = _avatarService.GenerateAvatarUrl(color, emoji);

        // Create user
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Patient",
            FirstName = dto.FirstName ?? dto.Username, // Fallback to username
            LastName = dto.LastName ?? "",
            Phone = dto.Phone,
            DateOfBirth = dto.DateOfBirth,
            Address = dto.Address,
            AvatarColor = color,
            AvatarEmoji = emoji,
            ProfileImageUrl = avatarUrl
        };

        var userId = await _userRepository.CreateAsync(user);
        if (userId == null)
        {
            Console.WriteLine("Failed to create user for patient registration");
            return null;
        }

        // Create patient
        var patient = new Patient
        {
            UserId = userId,
            MedicalRecordNumber = medicalRecordNumber,
            BloodType = dto.BloodType,
            Allergies = new List<string>(),
            ChronicConditions = new List<string>(),
            EmergencyContact = new EmergencyContact(),
            InsuranceInfo = new InsuranceInfo()
        };

        return await _patientRepository.CreateAsync(patient);
    }

    public async Task<Patient?> GetPatientByUserIdAsync(string userId)
    {
        return await _patientRepository.GetByUserIdAsync(userId);
    }

    public async Task<Patient?> GetPatientByIdAsync(string patientId)
    {
        return await _patientRepository.GetByIdAsync(patientId);
    }

    public async Task<List<Patient>> GetAllPatientsAsync()
    {
        return await _patientRepository.GetAllAsync();
    }

    public async Task<bool> UpdatePatientAsync(string id, Patient patient)
    {
        return await _patientRepository.UpdateAsync(id, patient);
    }

    public async Task<bool> UpdateMedicalInfoAsync(string patientId, List<string> allergies, List<string> chronicConditions)
    {
        return await _patientRepository.UpdateMedicalInfoAsync(patientId, allergies, chronicConditions);
    }

    public async Task<bool> DeletePatientAsync(string id)
    {
        return await _patientRepository.DeleteAsync(id);
    }

    public async Task<List<Prescription>> GetPatientPrescriptionsAsync(string userId)
    {
        var patient = await _patientRepository.GetByUserIdAsync(userId);
        if (patient == null)
            return new List<Prescription>();

        return await _prescriptionRepository.GetByPatientIdAsync(patient.Id);
    }

    public async Task<Prescription?> UploadPrescriptionAsync(string patientId, string imageData, string fileName, int? pharmacyId, string? pharmacyName, string? notes)
    {
        // Create a new prescription record from uploaded image
        var prescription = new Prescription
        {
            PatientId = patientId,
            PrescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
            ImageData = imageData,
            ImageFileName = fileName,
            PharmacyId = pharmacyId,
            PharmacyName = pharmacyName,
            Notes = notes,
            Status = "Pending",
            PrescriptionSource = "Uploaded",
            Medications = new List<Medication>(), // Will be filled in after OCR/manual review
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Save to MongoDB
        var prescriptionId = await _prescriptionRepository.CreateAsync(prescription);
        if (string.IsNullOrEmpty(prescriptionId))
            return null;

        prescription.Id = prescriptionId;
        return prescription;
    }

    public async Task<string?> CreatePatientAsync(Patient patient)
    {
        return await _patientRepository.CreateAsync(patient);
    }

    public async Task<bool> CancelPrescriptionAsync(string userId, string prescriptionId)
    {
        var patient = await _patientRepository.GetByUserIdAsync(userId);
        if (patient == null)
            return false;

        Prescription? prescription = null;
        if (ObjectId.TryParse(prescriptionId, out _))
            prescription = await _prescriptionRepository.GetByIdAsync(prescriptionId);
        if (prescription == null || prescription.PatientId != patient.Id)
            return false;

        if (!string.Equals(prescription.Status, "Pending", StringComparison.OrdinalIgnoreCase))
            return false;

        return await _prescriptionRepository.DeleteAsync(prescription.Id);
    }
}