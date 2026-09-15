namespace HealthCarePlus.API.DTOs;

public class LogAdherenceDto
{
    public string PrescriptionId { get; set; } = null!;
    public string MedicationId { get; set; } = null!;
    public DateTime ScheduledTime { get; set; }
    public string Status { get; set; } = "Taken"; // Taken, Missed, Late
    public string? Notes { get; set; }
}

public class RefillRequestDto
{
    public string PrescriptionId { get; set; } = null!;
    public string Notes { get; set; } = null!;
}

public class UploadPrescriptionDto
{
    public string ImageData { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string? PharmacyId { get; set; }
    public string? PharmacyName { get; set; }
    public string? Notes { get; set; }
}