
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { FileText, Users, Upload, LayoutDashboard } from 'lucide-react';

const Header = () => {
  // Safe usage of useLocation hook
  const location = useLocation();
  
  // Only show navigation to administrative URLs if we're on an admin-related page
  const isAdminPage = location.pathname.includes('/admin') || 
                      location.pathname === '/' ||
                      location.pathname.includes('/upload') ||
                      location.pathname.includes('/view') ||
                      location.pathname.includes('/manage');
  
  return (
    <header className="border-b">
      <div className="max-container h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold text-xl flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            DocSign
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAdminPage && (
            <>
              <Link
                to="/admin"
                className="text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              
              <Link
                to="/manage"
                className="text-sm px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage
              </Link>
              
              <Link
                to="/upload"
                className="text-sm bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
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
