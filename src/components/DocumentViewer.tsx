
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Check, 
  ArrowDown, 
  Loader2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SignatureCanvas from './SignatureCanvas';

// We would typically use a PDF library like react-pdf
// For this prototype, we'll create a simulated PDF viewer
interface DocumentViewerProps {
  documentUrl: string;
  documentName: string;
  onSignatureComplete: (
    signatureData: string, 
    signatureType: 'draw' | 'type' | 'upload',
    name: string
  ) => void;
  loading?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentUrl,
  documentName,
  onSignatureComplete,
  loading = false
}) => {
  // State for our simulated PDF viewer
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Simulated total pages
  const [reachedEnd, setReachedEnd] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Simulated page content
  const simulatedPages = [
    "This is the first page of the document. It contains important legal information.",
    "This is the second page which outlines the agreement terms.",
    "The third page continues with more specific details about obligations.",
    "Page four contains information about timeline and deliverables.",
    "This is the final page with signature requirements and legal notices."
  ];
  
  useEffect(() => {
    // Check if user has scrolled to the bottom
    const handleScroll = () => {
      if (!viewerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = viewerRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      if (atBottom && currentPage === totalPages) {
        setReachedEnd(true);
      }
    };
    
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.addEventListener('scroll', handleScroll);
      return () => viewer.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage, totalPages]);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const scrollToBottom = () => {
    if (viewerRef.current) {
      viewerRef.current.scrollTo({
        top: viewerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  
  const handleSignatureComplete = (
    signatureData: string, 
    signatureType: 'draw' | 'type' | 'upload',
    name: string
  ) => {
    onSignatureComplete(signatureData, signatureType, name);
    setShowSignatureModal(false);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Document header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-card rounded-t-lg border border-border">
        <div>
          <h3 className="text-base font-medium">{documentName}</h3>
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={scrollToBottom}
            className="ml-2"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Document viewer */}
      <Card className="flex-1 relative overflow-hidden border">
        <div 
          ref={viewerRef}
          className="h-full overflow-y-auto" 
          style={{ 
            scrollBehavior: 'smooth',
            height: 'calc(100vh - 300px)'
          }}
        >
          {/* In a real app, we would render the actual PDF content */}
          <CardContent className="p-8 h-full">
            {simulatedPages.slice(0, currentPage).map((content, index) => (
              <div 
                key={index} 
                className="mb-12 p-8 border border-border rounded-lg bg-white"
              >
                {/* This is just a placeholder, in a real app this would be PDF content */}
                <h4 className="text-lg font-medium mb-4">Page {index + 1}</h4>
                <p className="text-muted-foreground">{content}</p>
                
                {index === totalPages - 1 && (
                  <div className="mt-8 pt-8 border-t border-dashed border-border">
                    <p className="text-sm font-medium mb-2">Signature required:</p>
                    <div className="h-20 border border-dashed border-border rounded-md flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Signature will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </div>
        
        {/* Document footer with signature button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border rounded-b-lg">
          <div className="flex items-center justify-between">
            {!reachedEnd ? (
              <Badge className="bg-yellow-100 text-yellow-700">
                Scroll to the end to sign
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-700">
                <Check className="h-3 w-3 mr-1" />
                Ready to sign
              </Badge>
            )}
            
            <Button
              onClick={() => setShowSignatureModal(true)}
              disabled={!reachedEnd || loading}
              className="ml-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Sign Document
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Signature modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md animate-fade-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-medium">Sign Document</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSignatureModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <SignatureCanvas onSave={handleSignatureComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
