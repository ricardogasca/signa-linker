
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useDocuments } from '@/context/DocumentContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/documentUtils';
import { toast } from 'sonner';
import { 
  Users, 
  FileText, 
  Send, 
  Plus, 
  Clock, 
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Download,
  UserPlus
} from 'lucide-react';
import { createSignedPdf } from '@/utils/pdfUtils';

const DocumentManagement = () => {
  const { documents, sendSignatureLink, getDocument } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('documents');
  const [recipients, setRecipients] = useState<{[id: string]: { name: string, email: string, docs: string[] }}>({});
  const [sharedLinkId, setSharedLinkId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  // Extract unique recipients from documents
  useEffect(() => {
    const extractedRecipients: {[id: string]: { name: string, email: string, docs: string[] }} = {};
    
    documents.forEach(doc => {
      if (doc.recipient && doc.recipient.recipientId) {
        const { recipientId, name, email } = doc.recipient;
        
        if (!extractedRecipients[recipientId]) {
          extractedRecipients[recipientId] = {
            name,
            email,
            docs: []
          };
        }
        
        extractedRecipients[recipientId].docs.push(doc.id);
      }
    });
    
    setRecipients(extractedRecipients);
  }, [documents]);

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDocument = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(prev => prev.filter(docId => docId !== id));
    } else {
      setSelectedDocuments(prev => [...prev, id]);
    }
  };

  const handleOpenSendDialog = () => {
    if (selectedDocuments.length === 0) {
      toast.error("No documents selected", {
        description: "Please select at least one document to send."
      });
      return;
    }
    
    setSelectedDocumentIds(selectedDocuments);
    setIsDialogOpen(true);
  };

  const handleSendDocuments = () => {
    if (!recipientEmail || !recipientName || selectedDocumentIds.length === 0) {
      toast.error("Missing information", {
        description: "Please provide recipient information and select documents."
      });
      return;
    }

    // Send the selected documents to the recipient
    const recipientId = sendSignatureLink(selectedDocumentIds, recipientEmail, recipientName);
    
    // Generate link for the recipient
    const link = `/sign/${recipientId}`;
    const fullLink = window.location.origin + link;
    
    // Copy link to clipboard
    navigator.clipboard.writeText(fullLink);
    
    // Set the shared link ID for display
    setSharedLinkId(recipientId);
    
    toast.success("Documents sent for signature", {
      description: `A signature request has been sent to ${recipientEmail}. Link copied to clipboard.`
    });

    // Reset form
    setRecipientEmail('');
    setRecipientName('');
    setSelectedDocumentIds([]);
    setSelectedDocuments([]);
    setIsDialogOpen(false);
  };

  const handleResendToRecipient = (recipientId: string, name: string, email: string, docIds: string[]) => {
    // Resend the same documents to the recipient
    sendSignatureLink(docIds, email, name);
    
    toast.success("Documents resent for signature", {
      description: `The signature request has been resent to ${email}.`
    });
  };

  const handleDownloadSigned = (documentId: string) => {
    const doc = getDocument(documentId);
    if (doc && doc.status === 'signed' && doc.signature) {
      createSignedPdf(doc);
    } else {
      toast.error("Cannot download", {
        description: "This document is not signed yet."
      });
    }
  };

  const getDocumentsByStatus = (status: 'unsigned' | 'sent' | 'viewed' | 'signed') => {
    return documents.filter(doc => doc.status === status);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-container px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Document Management</h1>
              <p className="text-muted-foreground">
                Manage documents and send to recipients for signature
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <Button 
                onClick={handleOpenSendDialog}
                disabled={selectedDocuments.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Selected ({selectedDocuments.length})
              </Button>
              
              <Button asChild variant="outline">
                <a href="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New
                </a>
              </Button>
            </div>
          </div>

          {sharedLinkId && (
            <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-medium">Documents shared successfully</h3>
                      <p className="text-sm text-muted-foreground">Share this link with the recipient:</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const link = `/sign/${sharedLinkId}`;
                      const fullLink = window.location.origin + link;
                      navigator.clipboard.writeText(fullLink);
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
                <div className="mt-2 p-2 bg-background rounded border text-sm font-mono truncate">
                  {window.location.origin}/sign/{sharedLinkId}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs 
            defaultValue="documents" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="recipients">
                <Users className="h-4 w-4 mr-2" />
                Recipients
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Document Library</CardTitle>
                  <CardDescription>
                    Select documents to send for signature
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map(doc => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              {doc.status === 'unsigned' && (
                                <Checkbox 
                                  checked={selectedDocuments.includes(doc.id)}
                                  onCheckedChange={() => handleSelectDocument(doc.id)}
                                />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                {doc.title}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(doc.uploaded)}</TableCell>
                            <TableCell>
                              {doc.status === 'unsigned' && <span className="text-slate-500">Unsigned</span>}
                              {doc.status === 'sent' && <span className="text-blue-500">Sent</span>}
                              {doc.status === 'viewed' && <span className="text-orange-500">Viewed</span>}
                              {doc.status === 'signed' && <span className="text-green-500">Signed</span>}
                            </TableCell>
                            <TableCell>
                              {doc.recipient ? (
                                <div className="flex items-center">
                                  <UserPlus className="h-3 w-3 mr-1 text-muted-foreground" />
                                  {doc.recipient.name}
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigate(`/view/${doc.id}`)}
                                  title="View document"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {doc.status === 'sent' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      if (doc.recipient) {
                                        handleResendToRecipient(
                                          doc.recipient.recipientId || '',
                                          doc.recipient.name,
                                          doc.recipient.email,
                                          [doc.id]
                                        );
                                      }
                                    }}
                                    title="Resend signature request"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                {doc.status === 'signed' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDownloadSigned(doc.id)}
                                    title="Download signed document"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            <div className="flex flex-col items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                              <p>No documents found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Total: {filteredDocuments.length} documents
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Unsigned: {getDocumentsByStatus('unsigned').length}
                    </span>
                    <span className="text-sm text-blue-500">
                      Sent: {getDocumentsByStatus('sent').length}
                    </span>
                    <span className="text-sm text-green-500">
                      Signed: {getDocumentsByStatus('signed').length}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="recipients">
              <Card>
                <CardHeader>
                  <CardTitle>Recipients</CardTitle>
                  <CardDescription>
                    Manage document recipients and track signature status
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.keys(recipients).length > 0 ? (
                        Object.entries(recipients).map(([recipientId, recipient]) => {
                          const recipientDocs = recipient.docs.map(id => 
                            documents.find(doc => doc.id === id)
                          ).filter(Boolean);
                          
                          const signedCount = recipientDocs.filter(doc => doc?.status === 'signed').length;
                          const allSigned = signedCount === recipientDocs.length;
                          
                          return (
                            <TableRow key={recipientId}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {recipient.name}
                                </div>
                              </TableCell>
                              <TableCell>{recipient.email}</TableCell>
                              <TableCell>{recipientDocs.length} document(s)</TableCell>
                              <TableCell>
                                {allSigned ? (
                                  <span className="flex items-center text-green-500">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    All Signed
                                  </span>
                                ) : (
                                  <span className="flex items-center text-amber-500">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {signedCount}/{recipientDocs.length} Signed
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      handleResendToRecipient(
                                        recipientId,
                                        recipient.name,
                                        recipient.email,
                                        recipient.docs
                                      );
                                    }}
                                    title="Resend all documents"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Resend
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      navigate(`/sign/${recipientId}`);
                                    }}
                                    title="View recipient's signing page"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            <div className="flex flex-col items-center justify-center">
                              <Users className="h-8 w-8 text-muted-foreground mb-2" />
                              <p>No recipients found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Send Documents Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Documents for Signature</DialogTitle>
                <DialogDescription>
                  Enter recipient details to send document(s) for signature.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Recipient Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@example.com"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Selected Documents ({selectedDocumentIds.length})</Label>
                  <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                    {selectedDocumentIds.map(id => {
                      const doc = documents.find(d => d.id === id);
                      return doc ? (
                        <div key={id} className="flex items-center py-2 border-b last:border-b-0">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">{doc.title}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendDocuments}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send for Signature
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentManagement;
