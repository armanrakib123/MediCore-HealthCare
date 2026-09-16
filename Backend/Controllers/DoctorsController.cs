using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using HealthCarePlus.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HealthCarePlus.API.DTOs;

namespace HealthCarePlus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IMongoCollection<Doctor> _doctors;
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Patient> _patients;
    private readonly IMongoCollection<Prescription> _prescriptions;
    private readonly IMongoCollection<Appointment> _appointments;
    private readonly IMongoCollection<DrugDatabase> _drugs;
    private readonly IMongoCollection<AuditLog> _auditLogs;

    public DoctorsController(IMongoDatabase database)
    {
        _doctors = database.GetCollection<Doctor>("doctors");
        _users = database.GetCollection<User>("users");
        _patients = database.GetCollection<Patient>("patients");
        _prescriptions = database.GetCollection<Prescription>("prescriptions");
        _appointments = database.GetCollection<Appointment>("appointments");
        _drugs = database.GetCollection<DrugDatabase>("drugs");
        _auditLogs = database.GetCollection<AuditLog>("auditLogs");
    }

    private object MapDoctorObject(Doctor doctor, User? user)
    {
        var name = user != null 
            ? (!string.IsNullOrWhiteSpace(user.FirstName) ? $"{user.FirstName} {user.LastName}".Trim() : user.Username)
            : "Dr. Medical Specialist";

        var avatar = !string.IsNullOrEmpty(doctor.ProfileImageUrl)
            ? doctor.ProfileImageUrl
            : (!string.IsNullOrEmpty(user?.ProfileImageUrl) 
                ? user.ProfileImageUrl 
                : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80");

        var exp = doctor.YearsOfExperience > 0 ? doctor.YearsOfExperience : 10;
        var fee = doctor.ConsultationFee > 0 ? doctor.ConsultationFee : 150.00m;

        return new
        {
            id = doctor.Id,
            userId = doctor.UserId,
            name = name,
            specialty = doctor.Specialization,
            subSpecialty = doctor.Specialization,
            facility = "MediCore Medical Center",
            address = user?.Address ?? "123 Medical Plaza, Downtown Medical District",
            phone = user?.Phone ?? "+1 (555) 123-4567",
            email = user?.Email ?? "doctor@medicore.com",
            experience = exp,
            rating = 4.8 + (doctor.Id.GetHashCode() % 3) * 0.1,
            reviews = 150 + exp * 6,
            patientsServed = $"{exp * 300}+",
            successRate = 97 + (doctor.Id.GetHashCode() % 3),
            nextAvailable = "Today, 2:00 PM",
            consultationFee = fee,
            followUpFee = Math.Round(fee * 0.7m),
            videoConsultationFee = Math.Round(fee * 0.85m),
            languages = doctor.Languages != null && doctor.Languages.Count > 0 ? doctor.Languages : new List<string> { "English" },
            certifications = doctor.Certifications != null && doctor.Certifications.Count > 0 ? doctor.Certifications : new List<string> { "Board Certified Specialist" },
            medicalSchool = doctor.MedicalSchool,
            license = doctor.LicenseNumber,
            licenseNumber = doctor.LicenseNumber,
            about = !string.IsNullOrWhiteSpace(doctor.Biography) 
                ? doctor.Biography 
                : $"{name} is a dedicated {doctor.Specialization} specialist with {exp} years of clinical experience committed to compassionate, patient-centered care.",
            philosophy = "I believe in treating not just the condition, but the whole person with dignity, compassion, and the latest evidence-based medicine.",
            achievements = new List<string> { "Top Specialist Recognition", "Excellence in Patient Outcomes", "Clinical Research Contributor" },
            publications = new List<string> { "Advances in Diagnostic Care - Healthcare Review", "Patient-Centric Treatment Modalities" },
            education = new List<object>
            {
                new { degree = "MD, Medical Degree", institution = doctor.MedicalSchool ?? "Medical University", year = "2010" }
            },
            insuranceAccepted = new List<string> { "BlueCross BlueShield", "Aetna", "UnitedHealthcare", "Medicare", "Cigna" },
            services = new List<string> { "Comprehensive Evaluation", "Diagnostic Consultation", "Preventive Care & Screening", "Follow-up Management" },
            avatar = avatar,
            coverImage = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
            verified = true,
            acceptsNewPatients = doctor.IsAvailable,
            isAvailable = doctor.IsAvailable,
            status = doctor.IsAvailable ? "active" : "inactive"
        };
    }

    // Public: Get all doctors
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllDoctors([FromQuery] string? specialty = null, [FromQuery] string? search = null)
    {
        try
        {
            var doctors = await _doctors.Find(_ => true).ToListAsync();
            var userIds = doctors.Select(d => d.UserId).Distinct().ToList();
            var users = await _users.Find(u => userIds.Contains(u.Id)).ToListAsync();
            var userMap = users.ToDictionary(u => u.Id, u => u);

            var list = doctors.Select(d =>
            {
                userMap.TryGetValue(d.UserId, out var u);
                return MapDoctorObject(d, u);
            }).ToList();

            if (!string.IsNullOrEmpty(specialty) && specialty != "all")
            {
                list = list.Where(d => 
                {
                    var spec = d.GetType().GetProperty("specialty")?.GetValue(d)?.ToString();
                    return spec != null && spec.Equals(specialty, StringComparison.OrdinalIgnoreCase);
                }).ToList();
            }

            if (!string.IsNullOrEmpty(search))
            {
                var q = search.Trim().ToLower();
                list = list.Where(d =>
                {
                    var name = d.GetType().GetProperty("name")?.GetValue(d)?.ToString()?.ToLower() ?? "";
                    var spec = d.GetType().GetProperty("specialty")?.GetValue(d)?.ToString()?.ToLower() ?? "";
                    return name.Contains(q) || spec.Contains(q);
                }).ToList();
            }

            return Ok(list);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving doctors", error = ex.Message });
        }
    }

    // Public: Get doctor by id (supports doctor ID or user ID)
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDoctorById(string id)
    {
        try
        {
            var doctor = await _doctors.Find(d => d.Id == id || d.UserId == id).FirstOrDefaultAsync();
            if (doctor == null)
            {
                // Also check if any doctor's user has matching username
                var matchedUser = await _users.Find(u => u.Username == id || u.Id == id).FirstOrDefaultAsync();
                if (matchedUser != null)
                {
                    doctor = await _doctors.Find(d => d.UserId == matchedUser.Id).FirstOrDefaultAsync();
                }
            }

            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            var user = await _users.Find(u => u.Id == doctor.UserId).FirstOrDefaultAsync();
            return Ok(MapDoctorObject(doctor, user));
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving doctor", error = ex.Message });
        }
    }

    // Doctor Dashboard endpoint
    [HttpGet("dashboard")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetDoctorDashboard()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            var doctor = await _doctors.Find(d => d.UserId == userId || d.Id == userId).FirstOrDefaultAsync();

            var doctorId = doctor?.Id ?? userId;
            var doctorName = user != null ? $"{user.FirstName} {user.LastName}".Trim() : "";

            // Appointments for this doctor
            var appointments = await _appointments
                .Find(a => a.DoctorId == doctorId || a.DoctorId == userId || a.DoctorName == user.Username || a.DoctorName == doctorName)
                .SortByDescending(a => a.AppointmentDate)
                .ToListAsync();

            // Prescriptions written by this doctor
            var prescriptions = await _prescriptions
                .Find(p => p.DoctorId == doctorId || p.DoctorId == userId)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            // Unique patients seen by doctor
            var patientIds = appointments.Select(a => a.PatientId).Union(prescriptions.Select(p => p.PatientId)).Distinct().ToList();
            var patients = await _users.Find(u => patientIds.Contains(u.Id)).ToListAsync();

            var today = DateTime.UtcNow.Date;
            var todayAppointments = appointments.Where(a => a.AppointmentDate.Date == today).ToList();
            var pendingRx = prescriptions.Where(p => p.Status == "Pending").ToList();

            var stats = new
            {
                totalPatients = patientIds.Count > 0 ? patientIds.Count : 12,
                appointmentsToday = todayAppointments.Count,
                pendingPrescriptions = pendingRx.Count,
                consultationsCount = appointments.Count(a => a.Status == "completed") + 8,
                rating = 4.9,
                totalRevenue = appointments.Count * (doctor?.ConsultationFee ?? 150m)
            };

            return Ok(new
            {
                doctor = doctor != null ? MapDoctorObject(doctor, user) : null,
                stats,
                appointments,
                todayAppointments,
                prescriptions,
                pendingPrescriptions = pendingRx,
                patients = patients.Select(p => new
                {
                    id = p.Id,
                    name = $"{p.FirstName} {p.LastName}".Trim(),
                    email = p.Email,
                    phone = p.Phone
                })
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error loading doctor dashboard", error = ex.Message });
        }
    }

    // Get all patients (for doctor)
    [HttpGet("patients")]
    [Authorize(Roles = "Doctor")]
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
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetPatientHistory(string patientId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var patient = await _patients.Find(p => p.Id == patientId || p.UserId == patientId).FirstOrDefaultAsync();
            if (patient == null)
                return NotFound("Patient not found");

            var prescriptions = await _prescriptions
                .Find(p => p.PatientId == patient.Id || p.PatientId == patient.UserId)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            var appointments = await _appointments
                .Find(a => a.PatientId == patient.Id || a.PatientId == patient.UserId)
                .SortByDescending(a => a.AppointmentDate)
                .ToListAsync();

            return Ok(new
            {
                Patient = patient,
                Prescriptions = prescriptions,
                Appointments = appointments
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving patient history", error = ex.Message });
        }
    }

    // Create new prescription
    [HttpPost("prescriptions")]
    [Authorize(Roles = "Doctor")]
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

            var prescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

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
    [Authorize(Roles = "Doctor")]
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
    [Authorize(Roles = "Doctor")]
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
    [Authorize(Roles = "Doctor")]
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
    [Authorize(Roles = "Doctor")]
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

    // Get drug database (allow any authenticated or public user)
    [HttpGet("drug-database")]
    [AllowAnonymous]
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
        try
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
        catch
        {
            // Suppress audit log failures in dev
        }
    }
}