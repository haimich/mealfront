
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import UserProfile from './UserProfile';
import { useAuth } from '@/context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Mealfront
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <Link 
                to="/create" 
                className="btn-primary flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>New Recipe</span>
              </Link>
            )}
            
            <UserProfile />
          </div>
          
        </div>
      </header>
      
      <main className="container mx-auto px-4 pb-12">
        {children}
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Recipe Book. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
