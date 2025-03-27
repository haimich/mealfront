
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, UserCircle, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserProfile } from '@/services/profileService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserProfile: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<{ username: string; avatarUrl: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userProfile = await getUserProfile(user.id);
        if (userProfile) {
          setProfile({
            username: userProfile.username,
            avatarUrl: userProfile.avatarUrl
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (authLoading || loading) {
    return <div className="h-8 w-8 animate-pulse bg-muted rounded-full"></div>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="btn-secondary text-sm px-4 py-2">
          Sign In
        </Link>
        <Link to="/signup" className="btn-primary text-sm px-4 py-2">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-8 w-8">
          {profile?.avatarUrl ? (
            <AvatarImage src={profile.avatarUrl} alt={profile.username} />
          ) : (
            <AvatarFallback className="bg-accent text-accent-foreground">
              <User size={16} />
            </AvatarFallback>
          )}
        </Avatar>
        <span className="text-sm font-medium hidden sm:inline-block">
          {profile?.username || user.email}
        </span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{profile?.username || 'User'}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex cursor-pointer items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
