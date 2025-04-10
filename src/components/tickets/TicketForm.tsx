
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTickets } from '@/hooks/useTickets';
import { TicketStatus, TicketPriority, SecurityTicket } from '@/types/common';

interface TicketFormProps {
  ticket?: SecurityTicket;
  isEditMode?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({ 
  ticket,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTicket, updateTicket } = useTickets();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(ticket?.title || '');
  const [description, setDescription] = useState(ticket?.description || '');
  const [status, setStatus] = useState<TicketStatus>(ticket?.status || 'open');
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority || 'medium');
  const [ticketType, setTicketType] = useState(ticket?.ticket_type || 'vulnerability');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && ticket) {
        await updateTicket(ticket.id, {
          title,
          description,
          status,
          priority,
          ticket_type: ticketType,
        });
        
        toast({
          title: 'Success',
          description: 'Ticket updated successfully',
        });
        
        navigate(`/tickets/${ticket.id}`);
      } else {
        const newTicket = await createTicket({
          title,
          description,
          status,
          priority,
          ticket_type: ticketType,
        });
        
        toast({
          title: 'Success',
          description: 'Ticket created successfully',
        });
        
        navigate(`/tickets/${newTicket.id}`);
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
      toast({
        title: 'Error',
        description: isEditMode 
          ? 'Failed to update ticket' 
          : 'Failed to create ticket',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the issue"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the issue..."
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TicketPriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as TicketStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={ticketType} 
                onValueChange={setTicketType}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vulnerability">Vulnerability</SelectItem>
                  <SelectItem value="incident">Security Incident</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/tickets')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TicketForm;
