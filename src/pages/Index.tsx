
import React from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Check, Link, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Document Signing Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Upload, send, and manage document signatures with ease. Your all-in-one solution for paperless document workflows.
                </p>
              </div>
              <div className="space-x-4">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate('/admin')}>
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => navigate('/login')}>
                    Sign In
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Easy Document Upload</h3>
                  <p className="text-muted-foreground">
                    Upload your documents in seconds. Support for various file formats.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Link className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Secure Sharing</h3>
                  <p className="text-muted-foreground">
                    Send secure signing links to recipients and track document status.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Legally Valid Signatures</h3>
                  <p className="text-muted-foreground">
                    Collect legally binding electronic signatures for your documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
