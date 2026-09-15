namespace HealthCarePlus.API.Services;

public class AvatarService
{
    private readonly string[] _colors = {
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", 
        "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9F43",
        "#C44569", "#F8B500", "#78E08F", "#3867D6", "#8854D0"
    };

    private readonly string[] _emojis = {
        "👨", "👩", "👨‍⚕️", "👩‍⚕️", "👨‍💼", "👩‍💼", "👨‍🎓", "👩‍🎓",
        "👨‍🔬", "👩‍🔬", "👨‍🏫", "👩‍🏫", "👨‍💻", "👩‍💻", "👨‍🎨", "👩‍🎨"
    };

    public (string color, string emoji) GenerateAvatar(string username)
    {
        // Generate consistent avatar based on username
        var hash = username.GetHashCode();
        
        var colorIndex = Math.Abs(hash) % _colors.Length;
        var emojiIndex = Math.Abs(hash >> 8) % _emojis.Length;
        
        return (_colors[colorIndex], _emojis[emojiIndex]);
    }

    public string GenerateAvatarUrl(string color, string emoji)
    {
        // Return a styled avatar URL or create a data URL
        var svg = $@"<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'>
            <rect width='100' height='100' fill='{color}' rx='50'/>
            <text x='50' y='65' font-size='40' text-anchor='middle' fill='white'>{emoji}</text>
        </svg>";
        
        return $"data:image/svg+xml;base64,{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(svg))}";
    }

    public string GetAvatarColor(string username)
    {
        var (color, _) = GenerateAvatar(username);
        return color;
    }

    public string GetAvatarEmoji(string username)
    {
        var (_, emoji) = GenerateAvatar(username);
        return emoji;
    }
}