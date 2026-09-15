using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using HealthCarePlus.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HealthCarePlus.API.DTOs;

namespace HealthCarePlus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Doctor")]
public class DoctorsController : ControllerBase
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Patient> _patients;
    private readonly IMongoCollection<Prescription> _prescriptions;
    private readonly IMongoCollection<DrugDatabase> _drugs;
    private readonly IMongoCollection<AuditLog> _auditLogs;

    public DoctorsController(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
        _patients = database.GetCollection<Patient>("patients");
        _prescriptions = database.GetCollection<Prescription>("prescriptions");
        _drugs = database.GetCollection<DrugDatabase>("drugs");
        _auditLogs = database.GetCollection<AuditLog>("auditLogs");
    }

    // Get all patients
    [HttpGet("patients")]
    public async Task<IActionResult> GetPatients()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var patients = await _patients.Find(p => true).ToListAsync();
            var patientUsers = await _users.Find(u => u.Role == "Patient").ToListAsync();

            var result = patients.Join(
                patientUsers,
                p => p.UserId,
                u => u.Id,
                (p, u) => new
                {
                    PatientId = p.Id,
                    UserId = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Phone = u.Phone,
                    MedicalRecordNumber = p.MedicalRecordNumber,
                    BloodType = p.BloodType,
                    Allergies = p.Allergies,
                    ChronicConditions = p.ChronicConditions
                }).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving patients", error = ex.Message });
        }
    }

    // Get patient history
    [HttpGet("patients/{patientId}/history")]
    public async Task<IActionResult> GetPatientHistory(string patientId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var patient = await _patients.Find(p => p.Id == patientId).FirstOrDefaultAsync();
            if (patient == null)
                return NotFound("Patient not found");

            var prescriptions = await _prescriptions
                .Find(p => p.PatientId == patientId)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            var result = new
            {
                Patient = patient,
                Prescriptions = prescriptions
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving patient history", error = ex.Message });
        }
    }

    // Create new prescription
    [HttpPost("prescriptions")]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionDto dto)
    {
        try
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(doctorId))
                return Unauthorized();

            var doctor = await _users.Find(u => u.Id == doctorId).FirstOrDefaultAsync();
            if (doctor == null || doctor.Role != "Doctor")
                return Forbid();

            // Generate prescription number
            var prescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

            // Validate medications against drug database and convert to model type
            var medications = new List<Medication>();
            foreach (var medicationDto in dto.Medications)
            {
                var drug = await _drugs.Find(d => d.DrugName.ToLower() == medicationDto.DrugName.ToLower()).FirstOrDefaultAsync();
                medications.Add(new Medication
                {
                    DrugId = drug?.Id ?? medicationDto.DrugId,
                    DrugName = medicationDto.DrugName,
                    Dosage = medicationDto.Dosage,
                    Frequency = medicationDto.Frequency,
                    Duration = medicationDto.Duration,
                    Quantity = medicationDto.Quantity,
                    RefillsAllowed = medicationDto.RefillsAllowed,
                    Instructions = medicationDto.Instructions
                });
            }

            var prescription = new Prescription
            {
                PrescriptionNumber = prescriptionNumber,
                DoctorId = doctorId,
                PatientId = dto.PatientId,
                Medications = medications,
                Diagnosis = dto.Diagnosis,
                Status = "Pending",
                ExpiryDate = DateTime.UtcNow.AddMonths(6),
                Notes = dto.Notes
            };

            await _prescriptions.InsertOneAsync(prescription);

            // Log the action
            await LogAuditAction(doctorId, "CREATE", "Prescription", prescription.Id, prescription);

            return Ok(new { message = "Prescription created successfully", prescription });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error creating prescription", error = ex.Message });
        }
    }

    // Get doctor's prescriptions
    [HttpGet("prescriptions")]
    public async Task<IActionResult> GetPrescriptions()
    {
        try
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(doctorId))
                return Unauthorized();

            var prescriptions = await _prescriptions
                .Find(p => p.DoctorId == doctorId)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(prescriptions);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving prescriptions", error = ex.Message });
        }
    }

    // Update prescription
    [HttpPut("prescriptions/{id}")]
    public async Task<IActionResult> UpdatePrescription(string id, [FromBody] UpdatePrescriptionDto dto)
    {
        try
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(doctorId))
                return Unauthorized();

            var prescription = await _prescriptions.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (prescription == null)
                return NotFound("Prescription not found");

            if (prescription.DoctorId != doctorId)
                return Forbid();

            // Convert medication DTOs to model type
            var medications = dto.Medications.Select(m => new Medication
            {
                DrugId = m.DrugId,
                DrugName = m.DrugName,
                Dosage = m.Dosage,
                Frequency = m.Frequency,
                Duration = m.Duration,
                Quantity = m.Quantity,
                RefillsAllowed = m.RefillsAllowed,
                Instructions = m.Instructions
            }).ToList();

            var update = Builders<Prescription>.Update
                .Set(p => p.Medications, medications)
                .Set(p => p.Diagnosis, dto.Diagnosis)
                .Set(p => p.Notes, dto.Notes)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _prescriptions.UpdateOneAsync(p => p.Id == id, update);

            await LogAuditAction(doctorId, "UPDATE", "Prescription", id, dto);

            return Ok(new { message = "Prescription updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error updating prescription", error = ex.Message });
        }
    }

    // Cancel prescription
    [HttpDelete("prescriptions/{id}")]
    public async Task<IActionResult> CancelPrescription(string id)
    {
        try
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(doctorId))
                return Unauthorized();

            var prescription = await _prescriptions.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (prescription == null)
                return NotFound("Prescription not found");

            if (prescription.DoctorId != doctorId)
                return Forbid();

            var update = Builders<Prescription>.Update
                .Set(p => p.Status, "Cancelled")
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _prescriptions.UpdateOneAsync(p => p.Id == id, update);

            await LogAuditAction(doctorId, "CANCEL", "Prescription", id, null);

            return Ok(new { message = "Prescription cancelled successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error cancelling prescription", error = ex.Message });
        }
    }

    // Sign prescription
    [HttpPost("prescriptions/{id}/sign")]
    public async Task<IActionResult> SignPrescription(string id, [FromBody] SignPrescriptionDto dto)
    {
        try
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(doctorId))
                return Unauthorized();

            var prescription = await _prescriptions.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (prescription == null)
                return NotFound("Prescription not found");

            if (prescription.DoctorId != doctorId)
                return Forbid();

            // In a real implementation, you would verify the digital signature
            var digitalSignature = $"SIGNED-{doctorId}-{DateTime.UtcNow:yyyyMMddHHmmss}";

            var update = Builders<Prescription>.Update
                .Set(p => p.DigitalSignature, digitalSignature)
                .Set(p => p.Status, "Approved")
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _prescriptions.UpdateOneAsync(p => p.Id == id, update);

            await LogAuditAction(doctorId, "SIGN", "Prescription", id, dto);

            return Ok(new { message = "Prescription signed successfully", digitalSignature });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error signing prescription", error = ex.Message });
        }
    }

    // Get drug database
    [HttpGet("drug-database")]
    public async Task<IActionResult> GetDrugDatabase([FromQuery] string? search = null)
    {
        try
        {
            var filter = string.IsNullOrEmpty(search) 
                ? Builders<DrugDatabase>.Filter.Empty 
                : Builders<DrugDatabase>.Filter.Regex(d => d.DrugName, new MongoDB.Bson.BsonRegularExpression(search, "i"));

            var drugs = await _drugs.Find(filter).ToListAsync();
            return Ok(drugs);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving drug database", error = ex.Message });
        }
    }

    private async Task LogAuditAction(string userId, string action, string resource, string resourceId, object? details)
    {
        var auditLog = new AuditLog
        {
            UserId = userId,
            Action = action,
            Resource = resource,
            ResourceId = resourceId,
            Details = details ?? new { },
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserAgent = HttpContext.Request.Headers["User-Agent"].ToString(),
            Timestamp = DateTime.UtcNow
        };

        await _auditLogs.InsertOneAsync(auditLog);
    }
}