
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const location = useLocation();
  
  // Only show navigation to administrative URLs if we're on an admin-related page
  const isAdminPage = location.pathname.includes('/admin') || 
                      location.pathname === '/' ||
                      location.pathname.includes('/upload');
  
  return (
    <header className="border-b">
      <div className="max-container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold text-xl">
            DocSign
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAdminPage && (
            <>
              <Link
                to="/admin"
                className="text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/upload"
                className="text-sm bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Upload
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
