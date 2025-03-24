
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Loader2, 
  CheckSquare,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentViewer from '@/components/DocumentViewer';
import { useDocuments } from '@/context/DocumentContext';
import { formatDate } from '@/utils/documentUtils';

const RecipientView = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('0');
  const { getMultipleDocumentsForRecipient, updateDocument, markAsSigned } = useDocuments();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get all documents for this recipient link
  const documents = id ? getMultipleDocumentsForRecipient(id) : [];
  const hasMultipleDocuments = documents.length > 1;
  const currentDoc = documents[parseInt(activeTab)];
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Update document status to 'viewed' if it was in 'sent' status
      if (id && documents.length > 0) {
        documents.forEach(doc => {
          if (doc.status === 'sent') {
            updateDocument(doc.id, { status: 'viewed' });
          }
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, documents, updateDocument]);
  
  const handleSignatureComplete = async (
    signatureData: string, 
    signatureType: 'draw' | 'type' | 'upload',
    name: string
  ) => {
    if (!currentDoc) return;
    
    setSigningInProgress(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update document with signature
      markAsSigned(currentDoc.id, signatureData, signatureType, name);
      
      toast({
        title: "Document signed successfully",
        description: "Your signature has been securely recorded.",
      });
      
      // If there are more documents to sign, move to the next one
      if (hasMultipleDocuments && parseInt(activeTab) < documents.length - 1) {
        const nextTabIndex = (parseInt(activeTab) + 1).toString();
        setActiveTab(nextTabIndex);
        
        toast({
          title: "Please sign the next document",
          description: `${documents.length - parseInt(activeTab) - 1} documents remaining.`,
        });
      }
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
  
  if (documents.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="border-b py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="font-semibold text-lg">Document Signing</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Document Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The document link has expired or is invalid.
            </p>
          </div>
        </main>
        
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Document Signing Service
        </footer>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="font-semibold text-lg">Document Signing</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {hasMultipleDocuments && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">Documents to Sign</h2>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList>
                  {documents.map((doc, index) => (
                    <TabsTrigger 
                      key={doc.id} 
                      value={index.toString()}
                      className="flex items-center"
                    >
                      <span className="mr-2">{index + 1}.</span>
                      <span className="max-w-[150px] truncate">{doc.title}</span>
                      {doc.status === 'signed' && (
                        <CheckSquare className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {documents.map((doc, index) => (
                  <TabsContent 
                    key={doc.id} 
                    value={index.toString()}
                    className="mt-4"
                  >
                    <Card className="mb-4">
                      <CardHeader className="pb-2">
                        <CardTitle>{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Status: <span className={doc.status === 'signed' ? "text-green-500 font-medium" : ""}>{doc.status}</span>
                        </p>
                        {doc.status === 'signed' && doc.signature && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Signed on {formatDate(doc.signature.timestamp)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading document...</p>
            </div>
          ) : currentDoc ? (
            <DocumentViewer 
              documentUrl={currentDoc.url}
              documentName={currentDoc.title}
              onSignatureComplete={handleSignatureComplete}
              loading={signingInProgress}
            />
          ) : null}
          
          {hasMultipleDocuments && (
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const prevTabIndex = Math.max(0, parseInt(activeTab) - 1).toString();
                  setActiveTab(prevTabIndex);
                }}
                disabled={activeTab === '0'}
              >
                Previous Document
              </Button>
              
              <Button
                onClick={() => {
                  const nextTabIndex = Math.min(documents.length - 1, parseInt(activeTab) + 1).toString();
                  setActiveTab(nextTabIndex);
                }}
                disabled={parseInt(activeTab) === documents.length - 1}
              >
                Next Document
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Document Signing Service
      </footer>
    </div>
  );
};

export default RecipientView;
