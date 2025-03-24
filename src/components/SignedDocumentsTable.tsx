
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, Check, Calendar, User } from 'lucide-react';
import { formatDate } from '@/utils/documentUtils';
import { Document } from '@/context/DocumentContext';

interface SignedDocumentsTableProps {
  documents: Document[];
  onViewDocument: (id: string) => void;
}

const SignedDocumentsTable: React.FC<SignedDocumentsTableProps> = ({
  documents,
  onViewDocument,
}) => {
  // Filter only signed documents
  const signedDocuments = documents.filter(doc => doc.status === 'signed');

  if (signedDocuments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No signed documents yet</h3>
        <p className="text-muted-foreground">
          When documents are signed, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>List of signed documents</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Signed By</TableHead>
            <TableHead>Date Signed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signedDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  {doc.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {doc.signature?.name || (doc.recipient?.name || 'Unknown')}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {doc.signature ? formatDate(doc.signature.timestamp) : 'N/A'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Signed
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDocument(doc.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SignedDocumentsTable;
