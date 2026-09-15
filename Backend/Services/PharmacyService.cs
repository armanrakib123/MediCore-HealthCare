using HealthCarePlus.API.DTOs;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;
using MongoDB.Bson;

namespace HealthCarePlus.API.Services;

public class PharmacyService
{
    private readonly IPharmacyRepository _pharmacyRepository;
    private readonly IUserRepository _userRepository;
    private readonly AvatarService _avatarService;

    public PharmacyService(IPharmacyRepository pharmacyRepository, IUserRepository userRepository, AvatarService avatarService)
    {
        _pharmacyRepository = pharmacyRepository;
        _userRepository = userRepository;
        _avatarService = avatarService;
    }

    public async Task<string?> RegisterPharmacyAsync(PharmacistRegisterDto dto)
    {
        // Check if username or email already exists
        var existingUser = await _userRepository.GetByUsernameAsync(dto.Username) ?? await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            return null;

        // Check if pharmacy license number already exists
        var existingPharmacy = await _pharmacyRepository.GetByLicenseNumberAsync(dto.LicenseNumber);
        if (existingPharmacy != null)
            return null;

        // Generate avatar
        var (color, emoji) = _avatarService.GenerateAvatar(dto.Username);
        var avatarUrl = _avatarService.GenerateAvatarUrl(color, emoji);

        // Create user
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Pharmacist",
            FirstName = dto.FirstName ?? dto.Username, // Fallback to username
            LastName = dto.LastName ?? "",
            Phone = dto.Phone,
            Address = dto.Address,
            LicenseNumber = dto.LicenseNumber,
            AvatarColor = color,
            AvatarEmoji = emoji,
            ProfileImageUrl = avatarUrl
        };

        var userId = await _userRepository.CreateAsync(user);
        if (userId == null)
        {
            Console.WriteLine("Failed to create user for pharmacy registration");
            return null;
        }

        // Create pharmacy
        var pharmacy = new Pharmacy
        {
            UserId = userId,
            PharmacyName = dto.PharmacyName,
            LicenseNumber = dto.LicenseNumber,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,
            ZipCode = dto.ZipCode,
            Phone = dto.Phone,
            Email = dto.Email,
            ProfileImageUrl = avatarUrl,
            IsActive = true
        };

        return await _pharmacyRepository.CreateAsync(pharmacy);
    }

    public async Task<Pharmacy?> GetPharmacyByUserIdAsync(string userId)
    {
        return await _pharmacyRepository.GetByUserIdAsync(userId);
    }

    public async Task<Pharmacy?> GetPharmacyByIdAsync(string pharmacyId)
    {
        return await _pharmacyRepository.GetByIdAsync(pharmacyId);
    }

    public async Task<List<Pharmacy>> GetAllPharmaciesAsync()
    {
        return await _pharmacyRepository.GetAllAsync();
    }

    public async Task<List<Pharmacy>> GetActivePharmaciesAsync()
    {
        return await _pharmacyRepository.GetActivePharmaciesAsync();
    }

    public async Task<bool> UpdatePharmacyAsync(string id, Pharmacy pharmacy)
    {
        return await _pharmacyRepository.UpdateAsync(id, pharmacy);
    }

    public async Task<bool> DeletePharmacyAsync(string id)
    {
        return await _pharmacyRepository.DeleteAsync(id);
    }
}