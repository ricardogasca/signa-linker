
import React, { useState } from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Link, Mail, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Document } from '@/context/DocumentContext';

interface SendDocumentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocuments: Document[];
  onSendLink: (recipientEmail: string, recipientName: string) => void;
}

const SendDocumentsDrawer: React.FC<SendDocumentsDrawerProps> = ({
  isOpen,
  onClose,
  selectedDocuments,
  onSendLink
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientEmail || !recipientName) {
      toast({
        title: "Missing information",
        description: "Please provide both recipient name and email.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedDocuments.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to send.",
        variant: "destructive"
      });
      return;
    }
    
    onSendLink(recipientEmail, recipientName);
    
    // Reset form
    setRecipientName('');
    setRecipientEmail('');
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-xl">Create Signature Request</DrawerTitle>
            <DrawerDescription>
              Send these documents to a recipient for signature.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Selected Documents ({selectedDocuments.length})</h4>
              
              <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                {selectedDocuments.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedDocuments.map(doc => (
                      <li key={doc.id} className="flex items-center text-sm py-1 border-b last:border-b-0">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="truncate flex-1">{doc.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents selected
                  </p>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input
                    id="recipient-name"
                    placeholder="John Smith"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="john.smith@example.com"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                  />
                </div>
                
                <Separator />
                
                <DrawerFooter className="px-0">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={selectedDocuments.length === 0 || !recipientName || !recipientEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Create Signature Request
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SendDocumentsDrawer;
