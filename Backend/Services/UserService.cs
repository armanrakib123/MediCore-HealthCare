using MongoDB.Driver;
using MongoDB.Bson;
using HealthCarePlus.API.Models;

namespace HealthCarePlus.API.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
    }

    public async Task<User?> GetByUsernameAsync(string username) =>
        await _users.Find(u => u.Username == username).FirstOrDefaultAsync();

    public async Task<User?> GetByEmailAsync(string email) =>
        await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByIdAsync(string id) =>
        await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task<string?> CreateAsync(User user)
    {
        try
        {
            // Generate ObjectId if not set
            if (string.IsNullOrEmpty(user.Id))
            {
                user.Id = ObjectId.GenerateNewId().ToString();
            }
            
            // Set default values for required fields if not provided
            if (string.IsNullOrEmpty(user.FirstName))
                user.FirstName = user.Username; // Fallback to username
            if (string.IsNullOrEmpty(user.LastName))
                user.LastName = ""; // Empty string for last name
                
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            
            await _users.InsertOneAsync(user);
            return user.Id;
        }
        catch (Exception ex)
        {
            // Log the exception for debugging
            Console.WriteLine($"Error creating user: {ex.Message}");
            return null;
        }
    }
    
    public async Task<List<User>> GetAllByRoleAsync(string role) => 
        await _users.Find(u => u.Role == role).ToListAsync();

    public async Task UpdateAsync(string id, User user) =>
        await _users.ReplaceOneAsync(u => u.Id == id, user);

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _users.DeleteOneAsync(u => u.Id == id);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}
