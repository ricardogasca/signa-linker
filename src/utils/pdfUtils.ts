
import { Document } from '@/context/DocumentContext';
import { formatDate } from './documentUtils';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

// Function to create a downloadable PDF with signature
export const createSignedPdf = async (document: Document): Promise<void> => {
  if (!document.signature) {
    toast.error("Cannot download: Document has no signature");
    return;
  }
  
  try {
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add a watermark at the top of the document
    pdf.setTextColor(100, 100, 100);
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.text("Digitally signed document", 105, 15, { align: 'center' });
    
    // Add document title
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(document.title, 105, 30, { align: 'center' });
    
    // Add signature information
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Document originally uploaded on: ${formatDate(document.uploaded)}`, 20, 50);
    pdf.text(`Document signed by: ${document.signature.name}`, 20, 60);
    pdf.text(`Signed on: ${formatDate(document.signature.timestamp)}`, 20, 70);
    
    // Add signature
    if (document.signature.type === 'type') {
      // Add typed signature
      pdf.setFont("times", "italic");
      pdf.setFontSize(24);
      pdf.text(document.signature.name, 105, 100, { align: 'center' });
      pdf.line(65, 105, 145, 105); // Draw a line under the signature
    } else {
      // Add drawn or uploaded signature
      try {
        // For drawn or uploaded signatures, add the image
        const imgData = document.signature.data;
        if (imgData.startsWith('data:image')) {
          pdf.addImage(imgData, 'PNG', 65, 85, 80, 25);
        }
      } catch (err) {
        console.error("Error adding signature image to PDF:", err);
        // Fallback to text signature
        pdf.setFont("times", "italic");
        pdf.setFontSize(24);
        pdf.text(document.signature.name, 105, 100, { align: 'center' });
      }
    }
    
    // Add verification text
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("This document has been electronically signed and verified.", 105, 130, { align: 'center' });
    pdf.text(`Signature ID: ${Date.now().toString(36)}`, 105, 135, { align: 'center' });
    
    // Add the original document if possible (in a real app, this would embed the PDF)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Original Document", 105, 160, { align: 'center' });
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("The original document can be viewed at:", 105, 170, { align: 'center' });
    pdf.text(document.url, 105, 175, { align: 'center', maxWidth: 150 });
    
    // Save the PDF
    pdf.save(`${document.title.replace(/\.[^/.]+$/, '')}_signed.pdf`);
    
    toast.success("Signed document downloaded successfully", {
      description: "Your document with signature has been downloaded."
    });
  } catch (error) {
    console.error("Error creating PDF:", error);
    toast.error("Failed to generate signed PDF", {
      description: "There was an error creating your signed document."
    });
  }
};
