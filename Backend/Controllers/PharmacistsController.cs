using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HealthCarePlus.API.DTOs;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Services;
using MongoDB.Driver;

namespace HealthCarePlus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Pharmacist")]
public class PharmacistsController : ControllerBase
{
    private readonly PharmacyService _pharmacyService;
    private readonly UserService _userService;
    private readonly IMongoDatabase _database;

    public PharmacistsController(PharmacyService pharmacyService, UserService userService, IMongoDatabase database)
    {
        _pharmacyService = pharmacyService;
        _userService = userService;
        _database = database;
    }

    // Get current pharmacist's pharmacy profile
    [HttpGet("profile")]
    public async Task<IActionResult> GetMyPharmacyProfile()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var pharmacy = await _pharmacyService.GetPharmacyByUserIdAsync(userId);
            if (pharmacy == null)
                return NotFound("Pharmacy profile not found");

            return Ok(pharmacy);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving pharmacy profile", error = ex.Message });
        }
    }

    // Update current pharmacist's pharmacy profile
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateMyPharmacyProfile([FromBody] Pharmacy pharmacyUpdate)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var pharmacy = await _pharmacyService.GetPharmacyByUserIdAsync(userId);
            if (pharmacy == null)
                return NotFound("Pharmacy profile not found");

            // Update the pharmacy with new data
            pharmacy.PharmacyName = pharmacyUpdate.PharmacyName;
            pharmacy.Address = pharmacyUpdate.Address;
            pharmacy.City = pharmacyUpdate.City;
            pharmacy.State = pharmacyUpdate.State;
            pharmacy.ZipCode = pharmacyUpdate.ZipCode;
            pharmacy.Phone = pharmacyUpdate.Phone;
            pharmacy.Email = pharmacyUpdate.Email;
            pharmacy.OperatingHours = pharmacyUpdate.OperatingHours;
            pharmacy.IsOpen24Hours = pharmacyUpdate.IsOpen24Hours;
            pharmacy.Services = pharmacyUpdate.Services;
            pharmacy.DeliveryFee = pharmacyUpdate.DeliveryFee;
            pharmacy.OffersDelivery = pharmacyUpdate.OffersDelivery;
            pharmacy.ProfileImageUrl = pharmacyUpdate.ProfileImageUrl;
            pharmacy.UpdatedAt = DateTime.UtcNow;

            var result = await _pharmacyService.UpdatePharmacyAsync(pharmacy.Id, pharmacy);
            if (!result)
                return BadRequest("Failed to update pharmacy profile");

            return Ok(new { message = "Pharmacy profile updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error updating pharmacy profile", error = ex.Message });
        }
    }

    // Get all pharmacies (admin/pharmacist access)
    [HttpGet]
    public async Task<IActionResult> GetAllPharmacies()
    {
        try
        {
            var pharmacies = await _pharmacyService.GetAllPharmaciesAsync();
            return Ok(pharmacies);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving pharmacies", error = ex.Message });
        }
    }

    // Get active pharmacies
    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActivePharmacies()
    {
        try
        {
            var pharmacies = await _pharmacyService.GetActivePharmaciesAsync();
            return Ok(pharmacies);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving active pharmacies", error = ex.Message });
        }
    }

    // Get pharmacy by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPharmacyById(string id)
    {
        try
        {
            var pharmacy = await _pharmacyService.GetPharmacyByIdAsync(id);
            if (pharmacy == null)
                return NotFound("Pharmacy not found");

            return Ok(pharmacy);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving pharmacy", error = ex.Message });
        }
    }

    // Update pharmacy (admin access)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePharmacy(string id, [FromBody] Pharmacy pharmacy)
    {
        try
        {
            if (id != pharmacy.Id)
                return BadRequest("Pharmacy ID mismatch");

            var result = await _pharmacyService.UpdatePharmacyAsync(id, pharmacy);
            if (!result)
                return NotFound("Pharmacy not found");

            return Ok(new { message = "Pharmacy updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error updating pharmacy", error = ex.Message });
        }
    }

    // Delete pharmacy (admin access)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePharmacy(string id)
    {
        try
        {
            var result = await _pharmacyService.DeletePharmacyAsync(id);
            if (!result)
                return NotFound("Pharmacy not found");

            return Ok(new { message = "Pharmacy deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error deleting pharmacy", error = ex.Message });
        }
    }

    // Toggle pharmacy active status
    [HttpPatch("{id}/toggle-status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> TogglePharmacyStatus(string id)
    {
        try
        {
            var pharmacy = await _pharmacyService.GetPharmacyByIdAsync(id);
            if (pharmacy == null)
                return NotFound("Pharmacy not found");

            var newStatus = !pharmacy.IsActive;
            var update = Builders<Pharmacy>.Update
                .Set(p => p.IsActive, newStatus)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            var collection = _database.GetCollection<Pharmacy>("pharmacy");
            var result = await collection.UpdateOneAsync(p => p.Id == id, update);

            if (!result.IsAcknowledged || result.ModifiedCount == 0)
                return BadRequest("Failed to update pharmacy status");

            return Ok(new { message = $"Pharmacy {(newStatus ? "activated" : "deactivated")} successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error toggling pharmacy status", error = ex.Message });
        }
    }

    // Get pharmacies by city
    [HttpGet("by-city/{city}")]
    public async Task<IActionResult> GetPharmaciesByCity(string city)
    {
        try
        {
            var collection = _database.GetCollection<Pharmacy>("pharmacy");
            var filter = Builders<Pharmacy>.Filter.Eq(p => p.City, city) & Builders<Pharmacy>.Filter.Eq(p => p.IsActive, true);
            var pharmacies = await collection.Find(filter).ToListAsync();

            return Ok(pharmacies);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving pharmacies by city", error = ex.Message });
        }
    }

    // Get prescriptions submitted to the current pharmacy
    [HttpGet("prescriptions")]
    public async Task<IActionResult> GetPharmacyPrescriptions()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var pharmacy = await _pharmacyService.GetPharmacyByUserIdAsync(userId);
            if (pharmacy == null)
                return NotFound("Pharmacy profile not found");

            var collection = _database.GetCollection<Prescription>("prescriptions");
            var filter = Builders<Prescription>.Filter.Eq(p => p.PharmacyName, pharmacy.PharmacyName);
            var prescriptions = await collection.Find(filter).SortByDescending(p => p.CreatedAt).ToListAsync();

            return Ok(prescriptions);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving prescriptions", error = ex.Message });
        }
    }
}