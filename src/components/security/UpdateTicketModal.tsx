
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { toast } from '@/components/ui/use-toast';
import { format, addDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar as CalendarIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SecurityTicket, TicketStatus, TicketPriority } from '@/types/common';

interface UpdateTicketModalProps {
  ticket: SecurityTicket;
  open: boolean;
  onClose: () => void;
}

const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({ ticket, open, onClose }) => {
  const { user } = useAuth();
  const { users } = useUsers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: ticket.title,
    description: ticket.description || '',
    status: ticket.status,
    priority: ticket.priority,
    assignee_id: ticket.assignee_id || '',
    due_date: ticket.due_date ? new Date(ticket.due_date) : undefined,
    category: ticket.category || '',
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];
  
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];
  
  const categoryOptions = [
    { value: 'vulnerability', label: 'Vulnerability' },
    { value: 'incident', label: 'Security Incident' },
    { value: 'compliance', label: 'Compliance Issue' },
    { value: 'task', label: 'Task' },
    { value: 'other', label: 'Other' },
  ];
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Track what fields are changing
      const changes: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        const originalValue = (ticket as any)[key];
        
        // Special case for due_date which is a Date object in the form but a string in the ticket
        if (key === 'due_date') {
          const formattedDate = value ? format(value, 'yyyy-MM-dd') : null;
          const originalDate = ticket.due_date ? ticket.due_date.split('T')[0] : null;
          if (formattedDate !== originalDate) {
            changes[key] = {
              old: originalDate,
              new: formattedDate
            };
          }
        } else if (value !== originalValue) {
          changes[key] = {
            old: originalValue,
            new: value
          };
        }
      });
      
      const updateData = {
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('security_tickets')
        .update(updateData)
        .eq('id', ticket.id);
      
      if (error) throw error;
      
      // Log activities for each changed field
      const activityPromises = Object.entries(changes).map(([field, change]) => {
        let activityType: string;
        let details: any = { field, old_value: change.old, new_value: change.new };
        
        switch (field) {
          case 'status':
            activityType = 'status_changed';
            break;
          case 'assignee_id':
            activityType = 'assigned';
            details.assignee_id = change.new;
            break;
          case 'priority':
            activityType = 'priority_changed';
            break;
          case 'due_date':
            activityType = 'due_date_changed';
            break;
          default:
            activityType = 'updated';
        }
        
        return supabase
          .from('ticket_activities')
          .insert({
            ticket_id: ticket.id,
            user_id: user.id,
            activity_type: activityType,
            details,
          });
      });
      
      await Promise.all(activityPromises);
      
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Ticket</DialogTitle>
          <DialogDescription>
            Make changes to the ticket details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as TicketStatus)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleInputChange('priority', value as TicketPriority)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priority</SelectLabel>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category || ''} 
                onValueChange={(value) => handleInputChange('category', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select 
                value={formData.assignee_id || ''} 
                onValueChange={(value) => handleInputChange('assignee_id', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Assignee</SelectLabel>
                    <SelectItem value="">Unassigned</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.due_date && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.due_date ? (
                    format(formData.due_date, "PPP")
                  ) : (
                    <span>No due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={(date) => {
                    handleInputChange('due_date', date);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  disabled={(date) => date < addDays(new Date(), -1)}
                />
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => {
                      handleInputChange('due_date', undefined);
                      setCalendarOpen(false);
                    }}
                  >
                    Clear date
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide details about this ticket..."
              disabled={loading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTicketModal;
