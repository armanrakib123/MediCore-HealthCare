using MongoDB.Driver;
using HealthCarePlus.API.Models;
using HealthCarePlus.API.Repositories.Interfaces;

namespace HealthCarePlus.API.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(IMongoDatabase database) : base(database, "users") { }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _collection.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public override async Task<User?> GetByIdAsync(string id)
    {
        return await base.GetByIdAsync(id);
    }

    public async Task<List<User>> GetAllByRoleAsync(string role)
    {
        return await _collection.Find(u => u.Role == role).ToListAsync();
    }

    public override async Task<string?> CreateAsync(User user)
    {
        try
        {
            await _collection.InsertOneAsync(user);
            return user.Id;
        }
        catch
        {
            return null;
        }
    }
}