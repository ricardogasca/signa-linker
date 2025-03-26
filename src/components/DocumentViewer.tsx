
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
  const [reachedEnd, setReachedEnd] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Set a timer to automatically enable signing after a timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setReachedEnd(true);
    }, 8000); // 8 seconds should be enough to load and display PDF
    
    return () => clearTimeout(timeout);
  }, [documentUrl]);

  // Check for PDF load success
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const checkIframeLoaded = () => {
      try {
        // If we can access the iframe content, it means the PDF has loaded
        if (iframe.contentWindow?.document) {
          console.log("PDF iframe content accessed successfully");
          setPdfLoaded(true);
          
          // For security reasons, many browsers will block cross-origin iframe access
          // We'll use a fallback approach if we can't access the iframe content directly
          try {
            const iframeDoc = iframe.contentWindow.document;
            // Try to add a load event listener
            iframeDoc.addEventListener('scroll', () => {
              // If we got here, we can access the iframe content
              console.log("Iframe scroll event registered");
            });
          } catch (e) {
            console.log("Limited iframe access due to cross-origin policy:", e);
            // Use fallback: just mark as reached end after additional delay
            setTimeout(() => setReachedEnd(true), 3000);
          }
        }
      } catch (e) {
        console.log("Cannot access iframe content:", e);
      }
    };

    // Check if PDF is loaded
    iframe.onload = () => {
      console.log("PDF iframe onload triggered");
      setPdfLoaded(true);
      checkIframeLoaded();
      
      // Fallback: Enable signing after a short delay
      setTimeout(() => {
        setReachedEnd(true);
      }, 3000);
    };

    // Fallback for browsers where onload doesn't work properly
    setTimeout(checkIframeLoaded, 2000);

    return () => {
      if (iframe) {
        iframe.onload = null;
      }
    };
  }, [iframeRef.current]);
  
  const scrollToBottom = () => {
    if (viewerRef.current) {
      viewerRef.current.scrollTo({
        top: viewerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    
    // Try to scroll the iframe content
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframeDoc = iframeRef.current.contentWindow.document;
        iframeDoc.body.scrollTo({
          top: iframeDoc.body.scrollHeight,
          behavior: 'smooth'
        });
        
        // Mark as reached end when user explicitly scrolls to bottom
        setReachedEnd(true);
      } catch (e) {
        console.log("Could not scroll iframe content");
        // If we can't scroll iframe, still mark as reached end
        setReachedEnd(true);
      }
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
            {pdfLoaded ? 'Document loaded' : 'Loading document...'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
          {/* Render the actual PDF using an iframe */}
          <CardContent className="p-4 h-full">
            {!pdfLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <iframe 
              ref={iframeRef}
              src={documentUrl} 
              title={documentName}
              className="w-full h-full border-none"
              style={{ minHeight: 'calc(100vh - 350px)' }}
              onLoad={() => {
                console.log("PDF loaded in iframe");
                setPdfLoaded(true);
              }}
            />
          </CardContent>
        </div>
        
        {/* Document footer with signature button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border rounded-b-lg">
          <div className="flex items-center justify-between">
            {!reachedEnd ? (
              <Badge className="bg-yellow-100 text-yellow-700">
                Scroll to the end to sign or wait a moment
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
