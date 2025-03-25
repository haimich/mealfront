
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-semibold">Culinary Canvas</h1>
        </Link>

        {isMobile ? (
          <>
            <button onClick={toggleMenu} className="p-2 rounded-full">
              <Menu size={24} />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 left-0 glass animate-slide-in p-4 flex flex-col gap-2">
                <Link 
                  to="/" 
                  className={`p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create" 
                  className="btn-primary w-full flex justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  New Recipe
                </Link>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`p-2 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            >
              Dashboard
            </Link>
            <Link to="/create" className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} />
              <span>New Recipe</span>
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="animate-fade-in w-full">
          {children}
        </div>
      </main>

      <footer className="glass mt-auto p-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Culinary Canvas. All recipes are stored locally on your device.</p>
      </footer>
    </div>
  );
};

export default Layout;
