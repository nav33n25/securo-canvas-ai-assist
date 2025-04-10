import React, { useState, useEffect } from 'react';
import { SecurityTicket } from '@/types/common';
import { TicketStatus, TicketPriority } from '@/types/auth-types';
import TicketItem from './TicketItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface TicketListProps {
  tickets: SecurityTicket[];
  isLoading?: boolean;
  onStatusChange?: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
  onAssign?: (ticketId: string, userId: string) => Promise<void>;
  onCreateTicket?: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  isLoading = false,
  onStatusChange,
  onAssign,
  onCreateTicket
}) => {
  const [filteredTickets, setFilteredTickets] = useState<SecurityTicket[]>(tickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const ticketTypes = Array.from(new Set(tickets.map(ticket => ticket.ticket_type)));

  useEffect(() => {
    let result = [...tickets];
    
    if (searchQuery) {
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(ticket => ticket.ticket_type === typeFilter);
    }
    
    setFilteredTickets(result);
    
    const newActiveFilters: string[] = [];
    if (statusFilter !== 'all') newActiveFilters.push(`Status: ${statusFilter}`);
    if (priorityFilter !== 'all') newActiveFilters.push(`Priority: ${priorityFilter}`);
    if (typeFilter !== 'all') newActiveFilters.push(`Type: ${typeFilter}`);
    
    setActiveFilters(newActiveFilters);
  }, [tickets, searchQuery, statusFilter, priorityFilter, typeFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Status:')) setStatusFilter('all');
    if (filter.startsWith('Priority:')) setPriorityFilter('all');
    if (filter.startsWith('Type:')) setTypeFilter('all');
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Security Tickets</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-500">Loading tickets...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Security Tickets</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onCreateTicket}>
            <Plus className="h-4 w-4 mr-1" />
            Create Ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1.5 h-6 w-6" 
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Tickets</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <p className="text-xs font-medium mb-1">Status</p>
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <p className="text-xs font-medium mb-1">Priority</p>
                  <Select 
                    value={priorityFilter} 
                    onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
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
                
                <div className="p-2">
                  <p className="text-xs font-medium mb-1">Type</p>
                  <Select 
                    value={typeFilter} 
                    onValueChange={(value) => setTypeFilter(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {ticketTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={resetFilters}>
                  Reset All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </div>
          
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge 
                  key={filter} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {filter}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2" 
                onClick={resetFilters}
              >
                Clear all
              </Button>
            </div>
          )}
          
          {filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map(ticket => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onStatusChange={onStatusChange}
                  onAssign={onAssign}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Filter className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No tickets found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {tickets.length > 0 
                  ? "No tickets match your current filters. Try adjusting your search or filter criteria."
                  : "There are no security tickets yet. Create your first ticket to get started."
                }
              </p>
              {tickets.length === 0 && (
                <Button className="mt-4" onClick={onCreateTicket}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Ticket
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketList;
