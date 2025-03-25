
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="text-center px-4">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <Lock className="h-12 w-12" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Forbidden;
