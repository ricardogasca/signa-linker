
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Signature, Upload, FileText } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full py-4 border-b border-border glass sticky top-0 z-50">
      <div className="max-container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary">
          <Signature className="h-8 w-8" />
          <span className="font-medium text-xl tracking-tight">StrategySign</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-all-smooth hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/admin" 
            className={`text-sm font-medium transition-all-smooth hover:text-primary ${isActive('/admin') ? 'text-primary' : 'text-foreground'}`}
          >
            Admin
          </Link>
          <Link 
            to="/upload" 
            className={`text-sm font-medium transition-all-smooth hover:text-primary ${isActive('/upload') ? 'text-primary' : 'text-foreground'}`}
          >
            Upload
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link to="/admin">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
