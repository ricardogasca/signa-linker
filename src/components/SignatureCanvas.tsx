
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Download, Upload, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (signature: string, type: 'draw' | 'type' | 'upload', name: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'upload'>('draw');
  const [name, setName] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas properties
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000';
    
    // Clear canvas initially
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    if (signatureType === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl, 'draw', name);
    } else if (signatureType === 'type') {
      onSave(typedName, 'type', name);
    } else if (signatureType === 'upload' && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onSave(e.target.result.toString(), 'upload', name);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full p-4 border border-border rounded-lg bg-card animate-fade-in shadow-sm">
      <div className="mb-6">
        <Label htmlFor="signer-name">Your Full Name</Label>
        <Input 
          id="signer-name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <Tabs defaultValue="draw" onValueChange={(v) => setSignatureType(v as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="draw">Draw</TabsTrigger>
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="draw" className="focus:outline-none">
          <div className="signature-pad-container">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="signature-pad"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={clearCanvas}
              className="mr-2"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="type" className="focus:outline-none">
          <div className="mb-4">
            <Label htmlFor="typed-signature">Type Your Signature</Label>
            <Input
              id="typed-signature"
              placeholder="Type your signature here"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="p-4 border border-dashed border-border rounded-lg">
            <p className="text-lg font-handwriting text-center">
              {typedName || 'Your signature will appear here'}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="focus:outline-none">
          <div className="p-8 border border-dashed border-border rounded-lg text-center">
            <Input
              id="signature-upload"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Label 
              htmlFor="signature-upload" 
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium mb-1">Upload your signature</span>
              <span className="text-xs text-muted-foreground">
                Drag & drop or click to browse
              </span>
            </Label>
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-2 bg-accent rounded-md flex items-center justify-between">
              <span className="text-sm truncate">
                {selectedFile.name}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedFile(null)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Button 
          onClick={saveSignature} 
          disabled={
            (signatureType === 'draw' && !canvasRef.current) || 
            (signatureType === 'type' && !typedName) || 
            (signatureType === 'upload' && !selectedFile) ||
            !name
          }
          className="w-full"
        >
          <Check className="h-4 w-4 mr-2" />
          Sign Document
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
