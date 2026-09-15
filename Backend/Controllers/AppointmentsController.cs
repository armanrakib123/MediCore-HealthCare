using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using HealthCarePlus.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HealthCarePlus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IMongoCollection<Appointment> _appointments;
    private readonly IMongoCollection<User> _users;

    public AppointmentsController(IMongoDatabase database)
    {
        _appointments = database.GetCollection<Appointment>("appointments");
        _users = database.GetCollection<User>("users");
    }

    // Create a new appointment
    [HttpPost]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Handle both authenticated and anonymous appointments
        string patientName, patientEmail, patientId;
        
        if (!string.IsNullOrEmpty(userId))
        {
            // Authenticated user - get user details from database
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound("User not found");
            
            patientId = userId;
            patientName = user.Username;
            patientEmail = user.Email;
        }
        else
        {
            // Anonymous booking - use provided patient details
            patientId = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
            patientName = dto.PatientName ?? "Anonymous Patient";
            patientEmail = dto.PatientEmail ?? "anonymous@example.com";
        }

        var appointment = new Appointment
        {
            PatientId = patientId,
            PatientName = patientName,
            PatientEmail = patientEmail,
            DoctorId = dto.DoctorId,
            DoctorName = dto.DoctorName,
            DoctorSpecialty = dto.DoctorSpecialty,
            AppointmentDate = dto.AppointmentDate,
            TimeSlot = dto.TimeSlot,
            Reason = dto.Reason,
            Notes = dto.Notes,
            Status = "pending"
        };

        await _appointments.InsertOneAsync(appointment);

        return Ok(new { message = "Appointment created successfully", appointment });
    }

    // Get appointments for a patient (works with or without authentication)
    [HttpGet("patient")]
    public async Task<IActionResult> GetPatientAppointments([FromQuery] string? patientId = null)
    {
        // If no patientId provided, try to get it from authenticated user
        if (string.IsNullOrEmpty(patientId))
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userId))
                {
                    patientId = userId;
                }
                else
                {
                    return Ok(new List<Appointment>()); // Return empty list for anonymous users without patientId
                }
            }
            catch
            {
                // If authentication fails, return empty list instead of 401
                return Ok(new List<Appointment>());
            }
        }

        if (string.IsNullOrEmpty(patientId))
        {
            return Ok(new List<Appointment>());
        }

        var appointments = await _appointments
            .Find(a => a.PatientId == patientId)
            .SortByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(appointments);
    }

    // Get appointments for a doctor (shows patient names)
    [HttpGet("doctor")]
    [Authorize]
    public async Task<IActionResult> GetDoctorAppointments()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null || user.Role != "Doctor")
            return Forbid();

        // Get appointments where doctor name matches or doctorId matches
        var appointments = await _appointments
            .Find(a => a.DoctorId == userId || a.DoctorName == user.Username)
            .SortByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(appointments);
    }

    // Get all appointments (for admin)
    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAllAppointments()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null || user.Role != "Admin")
            return Forbid();

        var appointments = await _appointments
            .Find(_ => true)
            .SortByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(appointments);
    }

    // Update appointment status
    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateAppointmentStatus(string id, [FromBody] UpdateStatusDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var appointment = await _appointments.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (appointment == null)
            return NotFound("Appointment not found");

        // Only the patient, doctor, or admin can update
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null)
            return Unauthorized();

        if (appointment.PatientId != userId && appointment.DoctorId != userId && user.Role != "Admin" && user.Role != "Doctor")
            return Forbid();

        var update = Builders<Appointment>.Update
            .Set(a => a.Status, dto.Status)
            .Set(a => a.UpdatedAt, DateTime.UtcNow);

        await _appointments.UpdateOneAsync(a => a.Id == id, update);

        return Ok(new { message = "Appointment status updated" });
    }

    // Cancel appointment
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> CancelAppointment(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var appointment = await _appointments.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (appointment == null)
            return NotFound("Appointment not found");

        // Only the patient or admin can cancel
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (appointment.PatientId != userId && user?.Role != "Admin")
            return Forbid();

        var update = Builders<Appointment>.Update
            .Set(a => a.Status, "cancelled")
            .Set(a => a.UpdatedAt, DateTime.UtcNow);

        await _appointments.UpdateOneAsync(a => a.Id == id, update);

        return Ok(new { message = "Appointment cancelled" });
    }
}

// DTOs
public class CreateAppointmentDto
{
    public string? DoctorId { get; set; }
    public string DoctorName { get; set; } = null!;
    public string DoctorSpecialty { get; set; } = null!;
    public DateTime AppointmentDate { get; set; }
    public string TimeSlot { get; set; } = null!;
    public string Reason { get; set; } = null!;
    public string? Notes { get; set; }
    
    // For anonymous bookings
    public string? PatientName { get; set; }
    public string? PatientEmail { get; set; }
}

public class UpdateStatusDto
{
    public string Status { get; set; } = null!;
}
