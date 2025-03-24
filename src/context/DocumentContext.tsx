
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure of our document object
export interface Document {
  id: string;
  title: string;
  url: string;
  uploaded: string;
  status: 'unsigned' | 'sent' | 'viewed' | 'signed';
  recipient?: {
    name: string;
    email: string;
    recipientId?: string; // This will be used for grouping documents for one recipient
  };
  signature?: {
    data: string;
    type: 'draw' | 'type' | 'upload';
    name: string;
    timestamp: string;
  };
}

// Define the context interface
interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  addDocument: (document: Omit<Document, 'id' | 'uploaded'>) => void;
  getDocument: (id: string) => Document | undefined;
  getMultipleDocumentsForRecipient: (recipientId: string) => Document[];
  updateDocument: (id: string, updates: Partial<Document>) => void;
  sendSignatureLink: (ids: string[], email: string, name: string) => string;
  markAsSigned: (id: string, signatureData: string, signatureType: 'draw' | 'type' | 'upload', name: string) => void;
}

// Create context with a default value
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Sample data for our demo
const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Service Contract.pdf',
    url: '/sample-contract.pdf',
    uploaded: '2023-06-15T10:30:00Z',
    status: 'unsigned'
  },
  {
    id: '2',
    title: 'Non-Disclosure Agreement.pdf',
    url: '/sample-nda.pdf',
    uploaded: '2023-06-10T14:20:00Z',
    status: 'sent',
    recipient: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      recipientId: '1234'
    }
  },
  {
    id: '3',
    title: 'Employment Contract.pdf',
    url: '/sample-employment.pdf',
    uploaded: '2023-05-28T09:15:00Z',
    status: 'signed',
    recipient: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      recipientId: '5678'
    },
    signature: {
      data: 'data:image/png;base64,...',
      type: 'draw',
      name: 'Sarah Johnson',
      timestamp: '2023-05-29T11:42:00Z'
    }
  },
  {
    id: '4',
    title: 'Benefits Summary.pdf',
    url: '/sample-benefits.pdf',
    uploaded: '2023-05-28T09:20:00Z', 
    status: 'signed',
    recipient: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      recipientId: '5678'
    },
    signature: {
      data: 'data:image/png;base64,...',
      type: 'draw',
      name: 'Sarah Johnson',
      timestamp: '2023-05-29T11:45:00Z'
    }
  }
];

// Provider component
export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load from localStorage if available, otherwise use sample data
        const storedDocs = localStorage.getItem('documents');
        if (storedDocs) {
          setDocuments(JSON.parse(storedDocs));
        } else {
          setDocuments(sampleDocuments);
          // Save to localStorage
          localStorage.setItem('documents', JSON.stringify(sampleDocuments));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load documents');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0 && !loading) {
      localStorage.setItem('documents', JSON.stringify(documents));
    }
  }, [documents, loading]);

  // Add a new document
  const addDocument = (document: Omit<Document, 'id' | 'uploaded'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploaded: new Date().toISOString(),
      status: 'unsigned'
    };

    setDocuments(prev => [...prev, newDocument]);
  };

  // Get a document by id
  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  // Get multiple documents for a recipient by recipientId
  const getMultipleDocumentsForRecipient = (recipientId: string) => {
    return documents.filter(doc => 
      doc.recipient?.recipientId === recipientId
    );
  };

  // Update a document
  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    );
  };

  // Send signature link for multiple documents
  const sendSignatureLink = (ids: string[], email: string, name: string) => {
    // Generate a unique recipient ID
    const recipientId = Date.now().toString();
    
    // Update all the documents
    ids.forEach(id => {
      updateDocument(id, {
        status: 'sent',
        recipient: {
          email,
          name,
          recipientId
        }
      });
    });
    
    // In a real app, this would send an actual email
    console.log(`Signature link sent to ${email} for documents ${ids.join(', ')}`);
    
    // Return the recipient ID for use in the link
    return recipientId;
  };

  // Mark document as signed
  const markAsSigned = (
    id: string, 
    signatureData: string, 
    signatureType: 'draw' | 'type' | 'upload',
    name: string
  ) => {
    updateDocument(id, {
      status: 'signed',
      signature: {
        data: signatureData,
        type: signatureType,
        name,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        error,
        addDocument,
        getDocument,
        getMultipleDocumentsForRecipient,
        updateDocument,
        sendSignatureLink,
        markAsSigned
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

// Hook to use the document context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
