
import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/next-compatibility/router';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Search } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import type { SecurityTicket, TicketStatus, TicketPriority } from '@/types/common';

const statusColors = {
  'open': 'bg-blue-100 text-blue-800',
  'in_progress': 'bg-yellow-100 text-yellow-800',
  'review': 'bg-purple-100 text-purple-800',
  'closed': 'bg-gray-100 text-gray-800',
  'resolved': 'bg-green-100 text-green-800'
};

const priorityColors = {
  'low': 'bg-green-100 text-green-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800'
};

interface TicketListProps {
  tickets?: SecurityTicket[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function TicketList({ tickets: propTickets, isLoading: propIsLoading, error: propError }: TicketListProps = {}) {
  const router = useRouter();
  const { tickets: hookTickets, isLoading: hookIsLoading, error: hookError } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [filteredTickets, setFilteredTickets] = useState<SecurityTicket[]>([]);
  
  // Use props if provided, otherwise use hook values
  const tickets = propTickets || hookTickets;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;
  const error = propError || hookError;

  // Apply filters
  useEffect(() => {
    let result = [...tickets];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(term) || 
        (ticket.description && ticket.description.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setFilteredTickets(result);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleCreateTicket = () => {
    router.push('/tickets/new');
  };

  const handleTicketClick = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading tickets: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Button onClick={handleCreateTicket}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-40">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select 
              value={priorityFilter} 
              onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No tickets found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>
                    <Badge 
                      className={statusColors[ticket.status as keyof typeof statusColors] || ''} 
                      variant="outline"
                    >
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={priorityColors[ticket.priority as keyof typeof priorityColors] || ''} 
                      variant="outline"
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(ticket.updated_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
