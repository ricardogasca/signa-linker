
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Link, Mail, Clock, Check } from 'lucide-react';

export interface DocumentCardProps {
  id: string;
  title: string;
  uploaded: string;
  status: 'unsigned' | 'sent' | 'viewed' | 'signed';
  recipient?: {
    name: string;
    email: string;
  };
  onView: (id: string) => void;
  onSendLink?: (id: string) => void;
}

const statusConfig = {
  unsigned: { 
    label: 'Unsigned', 
    color: 'bg-secondary text-secondary-foreground',
    icon: FileText
  },
  sent: { 
    label: 'Sent', 
    color: 'bg-blue-100 text-blue-700',
    icon: Mail
  },
  viewed: { 
    label: 'Viewed', 
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock
  },
  signed: { 
    label: 'Signed', 
    color: 'bg-green-100 text-green-700',
    icon: Check
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  uploaded,
  status,
  recipient,
  onView,
  onSendLink
}) => {
  const { label, color, icon: StatusIcon } = statusConfig[status];
  
  return (
    <Card className="overflow-hidden transition-all-smooth hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium truncate" title={title}>
            {title}
          </CardTitle>
          <Badge className={`${color} ${status === 'unsigned' ? '' : 'animate-fade-in'}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {label}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Uploaded on {uploaded}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        {recipient && (
          <div className="text-sm space-y-1">
            <p className="font-medium text-xs text-muted-foreground">Recipient:</p>
            <p className="text-sm">{recipient.name}</p>
            <p className="text-xs text-muted-foreground">{recipient.email}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onView(id)}
          className="text-xs"
        >
          <FileText className="h-3.5 w-3.5 mr-1" />
          View
        </Button>
        
        {status === 'unsigned' && onSendLink && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSendLink(id)}
            className="text-xs"
          >
            <Link className="h-3.5 w-3.5 mr-1" />
            Create Link
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
