
// Helper functions for document operations

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format: Month Day, Year at Hour:Minute AM/PM
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format time ago for display
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Format date for older items
  return formatDate(dateString);
};

// Generate a unique document link
export const generateDocumentLink = (documentId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/view/${documentId}`;
};

// Validate file type (for upload)
export const validateFileType = (file: File): boolean => {
  const validTypes = ['application/pdf'];
  return validTypes.includes(file.type);
};

// Extract file name from path
export const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop() || filePath;
};

// Convert file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create a downloadable link for signed documents
export const createDownloadLink = (documentUrl: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = documentUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
