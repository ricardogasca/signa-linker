
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  FileText, 
  Link, 
  Check, 
  Clock, 
  Mail,
  Table
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentCard from '@/components/DocumentCard';
import SignedDocumentsTable from '@/components/SignedDocumentsTable';
import { useDocuments } from '@/context/DocumentContext';
import { useNavigate } from 'react-router-dom';
import { generateDocumentLink, formatDate } from '@/utils/documentUtils';

const AdminDashboard = () => {
  const { documents, loading, sendSignatureLink } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const unsignedDocuments = filteredDocuments.filter(doc => doc.status === 'unsigned');
  const sentDocuments = filteredDocuments.filter(doc => doc.status === 'sent');
  const signedDocuments = filteredDocuments.filter(doc => doc.status === 'signed');
  
  const handleViewDocument = (id: string) => {
    navigate(`/view/${id}`);
  };
  
  const handleSelectDocument = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(prev => prev.filter(docId => docId !== id));
    } else {
      setSelectedDocuments(prev => [...prev, id]);
    }
  };
  
  const handleOpenSendDialog = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to send.",
        variant: "destructive"
      });
      return;
    }
    
    setSendDialogOpen(true);
  };
  
  const handleSubmitSendLink = () => {
    if (selectedDocuments.length === 0 || !recipientEmail || !recipientName) return;
    
    // Send link for multiple documents
    const recipientId = sendSignatureLink(selectedDocuments, recipientEmail, recipientName);
    
    // Generate a link for the recipient (in a real app, this would be sent via email)
    const link = `/sign/${recipientId}`;
    
    toast({
      title: "Link generated successfully",
      description: `A signature request has been sent to ${recipientEmail}.`,
    });
    
    // Reset the form
    setRecipientName('');
    setRecipientEmail('');
    setSelectedDocuments([]);
    setSendDialogOpen(false);
    
    // Copy link to clipboard
    const fullLink = window.location.origin + link;
    navigator.clipboard.writeText(fullLink);
    
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link manually if needed.",
    });
  };
  
  const getStatusCount = (status: 'unsigned' | 'sent' | 'signed' | 'all') => {
    if (status === 'all') return documents.length;
    return documents.filter(doc => doc.status === status).length;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Document Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your documents and signature requests
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
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
                variant="outline" 
                onClick={() => setShowTable(!showTable)}
                className="hidden md:flex"
              >
                <Table className="h-4 w-4 mr-2" />
                {showTable ? "Card View" : "Table View"}
              </Button>
              
              <Button 
                onClick={handleOpenSendDialog}
                disabled={selectedDocuments.length === 0}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Selected
              </Button>
              
              <Button asChild>
                <a href="/upload">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload
                </a>
              </Button>
            </div>
          </div>
          
          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'All Documents', count: getStatusCount('all'), icon: FileText, color: 'bg-secondary' },
              { label: 'Unsigned', count: getStatusCount('unsigned'), icon: FileText, color: 'bg-secondary' },
              { label: 'Sent', count: getStatusCount('sent'), icon: Mail, color: 'bg-blue-100' },
              { label: 'Signed', count: getStatusCount('signed'), icon: Check, color: 'bg-green-100' }
            ].map((stat, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card/50 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-semibold">{stat.count}</p>
                  </div>
                  <div className={`${stat.color} p-2 rounded-md`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View toggle for signed documents */}
          {showTable && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Signed Documents</h2>
              <SignedDocumentsTable 
                documents={documents}
                onViewDocument={handleViewDocument}
              />
            </div>
          )}
          
          {/* Documents tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="unsigned">Unsigned</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="signed">Signed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="focus:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-48 rounded-lg border bg-card/50 animate-pulse"></div>
                  ))
                ) : filteredDocuments.length > 0 ? (
                  filteredDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      uploaded={formatDate(doc.uploaded)}
                      status={doc.status}
                      recipient={doc.recipient}
                      onView={handleViewDocument}
                      isSelected={selectedDocuments.includes(doc.id)}
                      onSelect={() => handleSelectDocument(doc.id)}
                      selectable={doc.status === 'unsigned'}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No documents found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? 'Try a different search term' : 'Upload your first document to get started'}
                    </p>
                    <Button asChild>
                      <a href="/upload">Upload Document</a>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="unsigned" className="focus:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unsignedDocuments.length > 0 ? (
                  unsignedDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      uploaded={formatDate(doc.uploaded)}
                      status={doc.status}
                      onView={handleViewDocument}
                      isSelected={selectedDocuments.includes(doc.id)}
                      onSelect={() => handleSelectDocument(doc.id)}
                      selectable={true}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No unsigned documents found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="sent" className="focus:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentDocuments.length > 0 ? (
                  sentDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      uploaded={formatDate(doc.uploaded)}
                      status={doc.status}
                      recipient={doc.recipient}
                      onView={handleViewDocument}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents have been sent for signature</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="signed" className="focus:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {signedDocuments.length > 0 ? (
                  signedDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      uploaded={formatDate(doc.uploaded)}
                      status={doc.status}
                      recipient={doc.recipient}
                      onView={handleViewDocument}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center">
                    <Check className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents have been signed yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Send Link Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Signature Link</DialogTitle>
            <DialogDescription>
              Generate a link to send to the recipient for signature.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">Selected Documents:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selectedDocuments.map(id => {
                  const doc = documents.find(d => d.id === id);
                  return doc ? (
                    <li key={id} className="flex items-center">
                      <FileText className="h-3 w-3 mr-2" />
                      {doc.title}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Recipient Name</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@example.com"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleSubmitSendLink}
              disabled={!recipientEmail || !recipientName || selectedDocuments.length === 0}
              className="w-full sm:w-auto"
            >
              <Link className="h-4 w-4 mr-2" />
              Generate Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
