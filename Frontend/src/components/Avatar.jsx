import React from 'react';

const Avatar = ({ 
  user, 
  size = 'medium', 
  showStatus = false, 
  className = '',
  onClick,
  defaultAvatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-2xl',
    xlarge: 'w-24 h-24 text-4xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const style = user?.avatarColor ? { backgroundColor: user.avatarColor } : {};

  // Use user's profile image, fallback to default avatar, then fallback to initials
  const avatarSrc = user?.profileImageUrl || defaultAvatarUrl;
  const showImage = user?.profileImageUrl || !user?.avatarEmoji;

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex items-center justify-center 
          font-medium text-white
          transition-all duration-300 hover:scale-105 cursor-pointer
          shadow-lg hover:shadow-xl
          relative overflow-hidden
        `}
        style={style}
      >
        {/* Animated background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full animate-shimmer"></div>
        
        {showImage ? (
          <img 
            src={avatarSrc} 
            alt={user?.username || 'Avatar'}
            className="w-full h-full rounded-full object-cover relative z-10"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback initials when no image or image fails */}
        <span 
          className="font-bold relative z-10"
          style={{ display: showImage ? 'none' : 'flex' }}
        >
          {user?.avatarEmoji || getInitials(user?.username)}
        </span>
        
        {/* Pulse ring animation */}
        <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping"></div>
      </div>
      
      {showStatus && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      )}
    </div>
  );
};

export default Avatar;