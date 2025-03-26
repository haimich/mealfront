
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
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
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
        <User size={16} />
      </div>
      <div className="text-sm">
        <p className="font-medium">{user.email}</p>
      </div>
      <button 
        onClick={signOut}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Sign out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};

export default UserProfile;
