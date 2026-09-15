using Microsoft.AspNetCore.Mvc;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.DTOs;
using HealthCarePlus.API.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace HealthCarePlus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly PatientService _patientService;

    public PatientsController(PatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPatients()
    {
        var patients = await _patientService.GetAllPatientsAsync();
        return Ok(patients);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPatientById(string id)
    {
        var patient = await _patientService.GetPatientByIdAsync(id);
        if (patient == null)
            return NotFound("Patient not found");

        return Ok(patient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(string id, [FromBody] Patient patient)
    {
        if (id != patient.Id)
            return BadRequest("Patient ID mismatch");

        var result = await _patientService.UpdatePatientAsync(id, patient);
        if (!result)
            return NotFound("Patient not found");

        return Ok(new { message = "Patient updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(string id)
    {
        var result = await _patientService.DeletePatientAsync(id);
        if (!result)
            return NotFound("Patient not found");

        return Ok(new { message = "Patient deleted successfully" });
    }

    [HttpGet("prescriptions")]
    [Authorize]
    public async Task<IActionResult> GetPrescriptions()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var prescriptions = await _patientService.GetPatientPrescriptionsAsync(userId);
            return Ok(prescriptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetPrescriptions: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet("dashboard")]
    [Authorize]
    public async Task<IActionResult> GetDashboard()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var patient = await _patientService.GetPatientByUserIdAsync(userId);
            if (patient == null)
                return NotFound("Patient not found");

            var prescriptions = await _patientService.GetPatientPrescriptionsAsync(userId);

            return Ok(new
            {
                Patient = patient,
                Prescriptions = prescriptions,
                HealthMetrics = new
                {
                    adherenceRate = 85,
                    totalPrescriptions = prescriptions.Count,
                    activeMedications = prescriptions.Count(p => p.Status == "Approved" || p.Status == "Dispensed")
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetDashboard: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpPost("prescriptions/upload")]
    [Authorize]
    public async Task<IActionResult> UploadPrescription([FromBody] UploadPrescriptionDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var patient = await _patientService.GetPatientByUserIdAsync(userId);
            if (patient == null)
                return NotFound("Patient not found");

            var prescription = await _patientService.UploadPrescriptionAsync(
                patient.Id,
                dto.ImageData ?? string.Empty,
                dto.FileName ?? string.Empty,
                int.TryParse(dto.PharmacyId, out var pharmacyIdParsed) ? pharmacyIdParsed : null,
                dto.PharmacyName,
                dto.Notes
            );

            if (prescription == null)
                return StatusCode(500, "Failed to upload prescription");

            return Ok(prescription);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in UploadPrescription: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpDelete("prescriptions/{id}")]
    [Authorize]
    public async Task<IActionResult> CancelPrescription(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var result = await _patientService.CancelPrescriptionAsync(userId, id);
            if (!result)
                return BadRequest("Unable to cancel prescription");

            return Ok(new { message = "Prescription cancelled" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in CancelPrescription: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }
}