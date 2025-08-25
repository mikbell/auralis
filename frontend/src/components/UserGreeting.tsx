import { useUser } from '@clerk/clerk-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getAdvancedGreeting, getPersonalizedSubtitle, getWelcomeMessage } from '@/utils/greetingUtils';
import { useAuthStore } from '@/stores/useAuthStore';

interface UserGreetingProps {
  style?: 'compact' | 'full' | 'hero';
  showAvatar?: boolean;
  showBadges?: boolean;
  greetingStyle?: 'formal' | 'casual' | 'enthusiastic';
  className?: string;
}

export default function UserGreeting({ 
  style = 'full',
  showAvatar = true,
  showBadges = true,
  greetingStyle = 'casual',
  className = '' 
}: UserGreetingProps) {
  const { user, isLoaded } = useUser();
  const { isAdmin } = useAuthStore();

  if (!isLoaded) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-muted rounded w-64 mb-2"></div>
        <div className="h-4 bg-muted rounded w-48"></div>
      </div>
    );
  }

  const userName = user?.firstName || user?.fullName;
  const userInitials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  // Determine if this is likely a first visit (basic heuristic)
  const isNewUser = !user?.lastSignInAt || 
    (new Date().getTime() - new Date(user.lastSignInAt).getTime()) < 24 * 60 * 60 * 1000; // Less than 24h since last login

  const greeting = isNewUser && style === 'hero' 
    ? getWelcomeMessage(userName || undefined)
    : getAdvancedGreeting(userName || undefined, {
        style: greetingStyle, 
        includeEmoji: style !== 'compact' 
      });

  const subtitle = getPersonalizedSubtitle();

  if (style === 'compact') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {showAvatar && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt={userName || 'User'} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <p className="font-medium text-sm">{greeting}</p>
          {showBadges && isAdmin && (
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          )}
        </div>
      </div>
    );
  }

  if (style === 'hero') {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        {showAvatar && (
          <div className="flex justify-center">
            <Avatar className="h-20 w-20 ring-4 ring-primary/20">
              <AvatarImage src={user?.imageUrl} alt={userName || 'User'} />
              <AvatarFallback className="text-2xl font-bold">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        )}
        <div>
          <h1 className="text-4xl sm:text-5xl font-black gradient-text-aurora mb-2">
            {greeting}
          </h1>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
          {showBadges && (
            <div className="flex justify-center mt-4 space-x-2">
              {isAdmin && (
                <Badge variant="secondary" className="bg-gradient-primary">
                  🎵 Admin
                </Badge>
              )}
              {isNewUser && (
                <Badge variant="outline">
                  ✨ Nuovo utente
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default 'full' style
  return (
    <div className={`flex items-start space-x-4 ${className}`}>
      {showAvatar && (
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.imageUrl} alt={userName || 'User'} />
          <AvatarFallback className="font-semibold">{userInitials}</AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-1 flex-1">
        <h2 className="text-2xl font-bold gradient-text-primary">
          {greeting}
        </h2>
        <p className="text-muted-foreground">{subtitle}</p>
        {showBadges && (
          <div className="flex space-x-2 mt-2">
            {isAdmin && (
              <Badge variant="secondary">
                👑 Admin
              </Badge>
            )}
            {user?.emailAddresses?.[0]?.emailAddress?.includes('.edu') && (
              <Badge variant="outline">
                🎓 Student
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
