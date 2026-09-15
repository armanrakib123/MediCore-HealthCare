using MongoDB.Driver;
using MongoDB.Bson;
using HealthCarePlus.API.Models;

namespace HealthCarePlus.API.Repositories;

public class BaseRepository<T> where T : class
{
    protected readonly IMongoCollection<T> _collection;

    public BaseRepository(IMongoDatabase database, string collectionName)
    {
        _collection = database.GetCollection<T>(collectionName);
    }

    public virtual async Task<T?> GetByIdAsync(string id)
    {
        return await _collection.Find(Builders<T>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(id))).FirstOrDefaultAsync();
    }

    public virtual async Task<List<T>> GetAllAsync()
    {
        return await _collection.Find(Builders<T>.Filter.Empty).ToListAsync();
    }

    public virtual async Task<string?> CreateAsync(T entity)
    {
        try
        {
            // Generate ObjectId if not set
            var idProperty = typeof(T).GetProperty("Id");
            if (idProperty != null && string.IsNullOrEmpty(idProperty.GetValue(entity)?.ToString()))
            {
                var objectId = ObjectId.GenerateNewId();
                idProperty.SetValue(entity, objectId.ToString());
            }
            
            await _collection.InsertOneAsync(entity);
            
            // Return the ID after successful insertion
            if (idProperty != null)
            {
                return idProperty.GetValue(entity)?.ToString();
            }
            
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating entity: {ex.Message}");
            return null;
        }
    }

    public virtual async Task<bool> UpdateAsync(string id, T entity)
    {
        try
        {
            var objectId = MongoDB.Bson.ObjectId.Parse(id);
            var result = await _collection.ReplaceOneAsync(Builders<T>.Filter.Eq("_id", objectId), entity);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
        catch
        {
            return false;
        }
    }

    public virtual async Task<bool> DeleteAsync(string id)
    {
        try
        {
            var objectId = MongoDB.Bson.ObjectId.Parse(id);
            var result = await _collection.DeleteOneAsync(Builders<T>.Filter.Eq("_id", objectId));
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
        catch
        {
            return false;
        }
    }
}