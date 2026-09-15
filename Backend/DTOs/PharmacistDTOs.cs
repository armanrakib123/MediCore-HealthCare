namespace HealthCarePlus.API.DTOs;

public class VerifyPrescriptionDto
{
    public string Notes { get; set; } = null!;
}

public class DispenseMedicationDto
{
    public string DispenseNotes { get; set; } = null!;
}

public class RejectPrescriptionDto
{
    public string Reason { get; set; } = null!;
}