
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

  // Check when document is scrolled
  useEffect(() => {
    // We need to monitor the iframe's content scroll position
    const checkScroll = () => {
      // If we already detected the end, no need to check again
      if (reachedEnd) return;
      
      try {
        if (iframeRef.current && pdfLoaded) {
          const iframe = iframeRef.current;
          // Try to access iframe content - might fail due to cross-origin restrictions
          // In that case, we'll use a fallback approach
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          
          if (iframeDoc) {
            const scrollHeight = iframeDoc.documentElement.scrollHeight;
            const scrollTop = iframeDoc.documentElement.scrollTop;
            const clientHeight = iframeDoc.documentElement.clientHeight;
            
            // If we're near the bottom, consider it "reached end"
            if (scrollTop + clientHeight >= scrollHeight - 100) {
              setReachedEnd(true);
            }
          }
        }
      } catch (e) {
        // Handle cross-origin iframe access errors with a fallback
        console.log("Cross-origin iframe limitation, using fallback approach");
        // If we can't access the iframe content, allow signing after a reasonable time
        setTimeout(() => {
          setReachedEnd(true);
        }, 10000); // 10 seconds should be enough to read a document
      }
    };
    
    // Set an interval to periodically check scroll position
    const interval = setInterval(checkScroll, 1000); 
    
    // Fallback: Allow signing after 25 seconds regardless
    const timeout = setTimeout(() => {
      setReachedEnd(true);
    }, 25000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pdfLoaded, reachedEnd]);
  
  const scrollToBottom = () => {
    if (viewerRef.current) {
      viewerRef.current.scrollTo({
        top: viewerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    
    // Additionally, try to scroll the iframe content
    try {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          iframeDoc.documentElement.scrollTo({
            top: iframeDoc.documentElement.scrollHeight,
            behavior: 'smooth'
          });
          
          // Mark as reached end when user explicitly scrolls to bottom
          setReachedEnd(true);
        }
      }
    } catch (e) {
      console.log("Could not scroll iframe content");
      // If we can't scroll iframe, still mark as reached end
      setReachedEnd(true);
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
                setPdfLoaded(true);
                // Set a timeout to auto-enable signing after 15 seconds 
                // This is a fallback in case scroll detection fails
                setTimeout(() => {
                  if (!reachedEnd) {
                    console.log("Enabling signing after timeout");
                    setReachedEnd(true);
                  }
                }, 15000);
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
