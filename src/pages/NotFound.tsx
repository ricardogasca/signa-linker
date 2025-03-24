
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-md">
          <FileQuestion className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-5xl font-semibold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We couldn't find the page you're looking for
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="default" size="lg">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/admin">
                View Documents
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
