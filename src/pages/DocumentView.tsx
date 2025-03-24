
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Loader2, 
  CheckSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentViewer from '@/components/DocumentViewer';
import { useDocuments } from '@/context/DocumentContext';
import { formatDate } from '@/utils/documentUtils';

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [signingInProgress, setSigningInProgress] = useState(false);
  const { getDocument, updateDocument, markAsSigned } = useDocuments();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const document = id ? getDocument(id) : undefined;
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Update document status to 'viewed' if it was in 'sent' status
      if (id && document && document.status === 'sent') {
        updateDocument(id, { status: 'viewed' });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [id, document, updateDocument]);
  
  const handleSignatureComplete = async (
    signatureData: string, 
    signatureType: 'draw' | 'type' | 'upload',
    name: string
  ) => {
    if (!id) return;
    
    setSigningInProgress(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update document with signature
      markAsSigned(id, signatureData, signatureType, name);
      
      toast({
        title: "Document signed successfully",
        description: "Your signature has been securely recorded.",
      });
      
      // Redirect to success page or stay on the same page
      // For this demo, we'll stay on the same page
    } catch (error) {
      toast({
        title: "Signing failed",
        description: "There was an error processing your signature.",
        variant: "destructive"
      });
    } finally {
      setSigningInProgress(false);
    }
  };
  
  if (!document) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Document Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/admin">Return to Dashboard</a>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold mb-1">{document.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Uploaded on {formatDate(document.uploaded)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {document.status === 'signed' && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Signed {document.signature ? formatDate(document.signature.timestamp) : ''}
                </div>
              )}
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading document...</p>
            </div>
          ) : (
            <DocumentViewer 
              documentUrl={document.url}
              documentName={document.title}
              onSignatureComplete={handleSignatureComplete}
              loading={signingInProgress}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentView;
