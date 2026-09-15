namespace HealthCarePlus.API.DTOs;

public record RegisterDto(string Username, string Email, string Password, string Role, string? Phone, DateTime? DateOfBirth);
public record LoginDto(string UsernameOrEmail, string Password);
public record SocialLoginDto(string? Email, string? FullName, string? ProviderId, string? AvatarUrl, string? IdToken);
public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string Email, string Token, string NewPassword);

// Doctor-specific DTOs
public record DoctorRegisterDto(
    string Username, 
    string Email, 
    string Password, 
    string FirstName, 
    string LastName,
    string Phone, 
    DateTime DateOfBirth,
    string LicenseNumber, 
    string Specialization, 
    string MedicalSchool, 
    int YearsOfExperience,
    List<string> Certifications,
    List<string> Languages,
    decimal ConsultationFee,
    string? Biography = null
);

public record DoctorLoginDto(string UsernameOrEmail, string Password);

// Pharmacist-specific DTOs
public record PharmacistRegisterDto(
    string Username, 
    string Email, 
    string Password, 
    string FirstName, 
    string LastName, 
    string Phone, 
    string PharmacyName, 
    string LicenseNumber, 
    string Address, 
    string City, 
    string State, 
    string ZipCode
);

public record PharmacistLoginDto(string UsernameOrEmail, string Password);

// Patient-specific DTOs
public record PatientRegisterDto(
    string Username, 
    string Email, 
    string Password, 
    string FirstName, 
    string LastName, 
    string Phone, 
    DateTime DateOfBirth, 
    string BloodType, 
    string Address
);

public record PatientLoginDto(string UsernameOrEmail, string Password);

public class AuthResponse
{
    public string Token { get; set; }
    public string Username { get; set; }
    public string Role { get; set; }
    public string? AvatarColor { get; set; }
    public string? AvatarEmoji { get; set; }
    public string? ProfileImageUrl { get; set; }
    
    // Doctor-specific properties
    public string? DoctorId { get; set; }
    public string? LicenseNumber { get; set; }
    public string? Specialization { get; set; }
    
    // Pharmacy-specific properties
    public string? PharmacyId { get; set; }
    public string? PharmacyName { get; set; }
    public string? PharmacyLicenseNumber { get; set; }
    
    // Patient-specific properties
    public string? PatientId { get; set; }
    public string? MedicalRecordNumber { get; set; }
    public string? BloodType { get; set; }

    public AuthResponse(string token, string username, string role, string? avatarColor, string? avatarEmoji, string? profileImageUrl)
    {
        Token = token;
        Username = username;
        Role = role;
        AvatarColor = avatarColor;
        AvatarEmoji = avatarEmoji;
        ProfileImageUrl = profileImageUrl;
    }
}
