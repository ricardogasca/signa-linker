
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
import SignedDocumentsTable from '@/components/SignedDocumentsTable';
import { createSignedPdf } from '@/utils/pdfUtils';

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [signingInProgress, setSigningInProgress] = useState(false);
  const { getDocument, updateDocument, markAsSigned, documents } = useDocuments();
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
    }, 1000);
    
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update document with signature
      markAsSigned(id, signatureData, signatureType, name);
      
      toast({
        title: "Document signed successfully",
        description: "Your signature has been securely recorded.",
      });
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
  
  const handleDownloadDocument = async () => {
    if (!document) return;
    
    if (document.status === 'signed' && document.signature) {
      // Download the signed version with signature
      try {
        await createSignedPdf(document);
        
        toast({
          title: "Download started",
          description: "Your signed document is being downloaded.",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "There was an error generating your signed document.",
          variant: "destructive"
        });
      }
    } else {
      // Just download the original document
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
              
              <Button variant="outline" size="sm" onClick={handleDownloadDocument}>
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
          
          {/* Signed Documents Table */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Signed Documents</h2>
            <SignedDocumentsTable 
              documents={documents}
              onViewDocument={(docId) => navigate(`/view/${docId}`)}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentView;
