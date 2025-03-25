
import { Document } from '@/context/DocumentContext';
import { formatDate } from './documentUtils';

// Function to create a downloadable PDF with signature
export const createSignedPdf = async (document: Document): Promise<void> => {
  if (!document.signature) {
    console.error("Cannot download: Document has no signature");
    return;
  }
  
  // In a real app, this would use a PDF generation library to add 
  // the signature, name, and timestamp to the PDF
  // For this demo, we're creating a simple HTML-based signed version
  
  const signedDocumentHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Signed Document - ${document.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .document-container { max-width: 800px; margin: 0 auto; }
        .header { border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
        .signature-box { border: 1px solid #ddd; padding: 20px; margin-top: 30px; }
        .signature-image { max-width: 300px; max-height: 100px; }
        .signature-typed { font-family: 'Brush Script MT', cursive; font-size: 24px; }
        .signature-info { color: #666; font-size: 14px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="document-container">
        <div class="header">
          <h1>${document.title}</h1>
          <p>Original document uploaded on ${formatDate(document.uploaded)}</p>
        </div>
        
        <iframe src="${document.url}" width="100%" height="500px"></iframe>
        
        <div class="signature-box">
          <h3>Document Signed By:</h3>
          ${document.signature.type === 'type' 
            ? `<p class="signature-typed">${document.signature.name}</p>` 
            : `<img class="signature-image" src="${document.signature.data}" alt="Signature" />`
          }
          <p>Signed by: ${document.signature.name}</p>
          <p class="signature-info">Digitally signed on ${formatDate(document.signature.timestamp)}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create a blob from the HTML content
  const blob = new Blob([signedDocumentHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${document.title.replace(/\.[^/.]+$/, '')}_signed.html`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
