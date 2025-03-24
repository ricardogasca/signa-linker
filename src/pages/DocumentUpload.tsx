
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  XCircle, 
  CheckCircle2, 
  File,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useDocuments } from '@/context/DocumentContext';
import { validateFileType, formatFileSize } from '@/utils/documentUtils';

const DocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addDocument } = useDocuments();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => validateFileType(file));
      
      if (validFiles.length !== filesArray.length) {
        toast({
          title: "Invalid file type",
          description: "Only PDF files are supported.",
          variant: "destructive"
        });
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = filesArray.filter(file => validateFileType(file));
      
      if (validFiles.length !== filesArray.length) {
        toast({
          title: "Invalid file type",
          description: "Only PDF files are supported.",
          variant: "destructive"
        });
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would upload to a server
      // For this demo, we'll simulate URLs
      
      // Add documents to context
      files.forEach(file => {
        const fakeUrl = URL.createObjectURL(file);
        
        addDocument({
          title: file.name,
          url: fakeUrl,
          status: 'unsigned'
        });
      });
      
      toast({
        title: "Upload successful",
        description: `${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully.`
      });
      
      // Navigate to admin dashboard
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your documents.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-container">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Upload Documents</h1>
            <p className="text-muted-foreground">
              Upload PDF documents for signature
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Upload Files</CardTitle>
                  <CardDescription>
                    Drag and drop your PDF files or click to browse
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                    />
                    
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Drop files here or click to browse
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Only PDF files are supported
                    </p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Selected Files</h4>
                      <div className="space-y-3">
                        {files.map((file, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 bg-accent rounded-lg animate-fade-in"
                          >
                            <div className="flex items-center">
                              <File className="h-5 w-5 text-primary mr-3" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isUploading}
                    className="min-w-[120px]"
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                  <CardDescription>
                    Important information about uploads
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Only PDF files are supported",
                      "Maximum file size is 10MB",
                      "Ensure documents are readable",
                      "Personal information should be accurate"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <div className="w-full p-3 bg-accent rounded-lg">
                    <p className="text-sm font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      After uploading
                    </p>
                    <p className="text-xs text-muted-foreground">
                      After upload, you can create signature links from the admin dashboard to send to recipients.
                    </p>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate('/admin')}
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    View Document Dashboard
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentUpload;
