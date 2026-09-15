namespace HealthCarePlus.API.DTOs;

public class CreatePrescriptionDto
{
    public string PatientId { get; set; } = null!;
    public List<MedicationDto> Medications { get; set; } = new();
    public string Diagnosis { get; set; } = null!;
    public string? Notes { get; set; }
}

public class UpdatePrescriptionDto
{
    public List<MedicationDto> Medications { get; set; } = new();
    public string Diagnosis { get; set; } = null!;
    public string? Notes { get; set; }
}

public class SignPrescriptionDto
{
    public string Signature { get; set; } = null!;
}

public class MedicationDto
{
    public string DrugId { get; set; } = null!;
    public string DrugName { get; set; } = null!;
    public string Dosage { get; set; } = null!;
    public string Frequency { get; set; } = null!;
    public string Duration { get; set; } = null!;
    public int Quantity { get; set; }
    public int RefillsAllowed { get; set; }
    public string Instructions { get; set; } = null!;
}



// Doctor Response DTO
public class DoctorResponseDto
{
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string LicenseNumber { get; set; } = null!;
    public string Specialization { get; set; } = null!;
    public string MedicalSchool { get; set; } = null!;
    public int YearsOfExperience { get; set; }
    public List<string> Certifications { get; set; } = new();
    public List<string> Languages { get; set; } = new();
    public string? Biography { get; set; }
    public string? ProfileImageUrl { get; set; }
    public bool IsAvailable { get; set; }
    public decimal ConsultationFee { get; set; }
    public DateTime CreatedAt { get; set; }
}