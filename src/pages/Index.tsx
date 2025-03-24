
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Signature, Upload, FileText, Check, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-accent/50 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent -z-10"></div>
          
          <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:pr-8 animate-slide-in">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
                Secure Document Signatures 
                <span className="text-primary"> Made Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Upload, send, and manage document signatures with confidence. Streamlined for businesses that value security and simplicity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/upload">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Document
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/admin">
                    <FileText className="h-5 w-5 mr-2" />
                    View Documents
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative lg:pl-8">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-card border animate-[slide-in_0.6s_ease-out]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Signature className="h-24 w-24 text-primary/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-card to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-lg glass">
                  <div className="flex items-center mb-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Secure Signature Ready</span>
                  </div>
                  <div className="h-8 w-3/4 bg-primary/10 rounded mb-3"></div>
                  <div className="h-4 w-1/2 bg-primary/10 rounded"></div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-primary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="max-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Streamlined Digital Signatures
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform makes document signing effortless and secure with features designed around simplicity and security.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Upload,
                  title: "Easy Document Upload",
                  description: "Securely upload documents in seconds with our intuitive interface."
                },
                {
                  icon: FileText,
                  title: "Generate Secure Links",
                  description: "Create unique links for recipients to securely view and sign documents."
                },
                {
                  icon: Check,
                  title: "Digital Signatures",
                  description: "Sign documents digitally with options to draw, type, or upload signatures."
                }
              ].map((feature, index) => (
                <Card key={index} className="border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all-smooth">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple three-step process designed for efficiency and security.
              </p>
            </div>
            
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-border hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    step: "01",
                    title: "Upload Your Document",
                    description: "Add your documents securely to our platform with just a few clicks."
                  },
                  {
                    step: "02",
                    title: "Generate Link",
                    description: "Create and share a secure link with your recipient."
                  },
                  {
                    step: "03",
                    title: "Collect Signatures",
                    description: "Recipients view the document and sign digitally."
                  }
                ].map((step, index) => (
                  <div key={index} className="relative flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center mb-6 z-10">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-center">{step.title}</h3>
                    <p className="text-muted-foreground text-center">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="max-container">
            <div className="rounded-xl overflow-hidden shadow-lg border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-semibold tracking-tight mb-4">
                    Ready to Streamline Your Document Signing?
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Get started today and experience the simplicity and security of our digital signature platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg">
                      <Link to="/upload">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/admin">View Demo</Link>
                    </Button>
                  </div>
                </div>
                
                <div className="relative bg-accent">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <Shield className="h-24 w-24 text-primary/20" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <Check className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                  </div>
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
