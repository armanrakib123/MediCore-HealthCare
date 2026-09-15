using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HealthCarePlus.API.Services;

namespace HealthCarePlus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var username = User?.Identity?.Name;
        if (username == null) return Unauthorized();
        var user = await _userService.GetByUsernameAsync(username);
        if (user == null) return NotFound();
        return Ok(new { user.Id, user.Username, user.Email, user.Role });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> All()
    {
        // For demo: return limited info
        await Task.CompletedTask;
        return Ok("Admin-only endpoint placeholder");
    }
}
