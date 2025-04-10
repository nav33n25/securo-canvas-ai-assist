import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSecurityTickets } from '@/services/securityDataService';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Ticket,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Timer,
  User,
  Calendar,
  ClipboardEdit,
  ThumbsUp,
  Loader2,
  Calendar as CalendarIcon,
  ClipboardList,
  Plus,
  FileText,
  ListFilter
} from 'lucide-react';

const TicketingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['securityTickets'],
    queryFn: getSecurityTickets
  });

  const filteredTickets = (tickets as SecurityTicket[])
    .filter(ticket => {
      if (searchQuery) {
        return ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(ticket => statusFilter === 'all' || ticket.status === statusFilter)
    .filter(ticket => priorityFilter === 'all' || ticket.priority === priorityFilter);

  const selectedTicketData = (tickets as SecurityTicket[]).find(ticket => ticket.id === selectedTicket);

  const openTickets = (tickets as SecurityTicket[]).filter(t => t.status === 'open').length;
  const inProgressTickets = (tickets as SecurityTicket[]).filter(t => t.status === 'in_progress').length;
  const pendingTickets = (tickets as SecurityTicket[]).filter(t => t.status === 'review').length;
  const resolvedTickets = (tickets as SecurityTicket[]).filter(t => t.status === 'resolved').length;
  const closedTickets = (tickets as SecurityTicket[]).filter(t => t.status === 'closed').length;

  const criticalTickets = (tickets as SecurityTicket[]).filter(t => t.priority === 'critical').length;
  const highTickets = (tickets as SecurityTicket[]).filter(t => t.priority === 'high').length;
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="h-8 w-8 text-secure" />
            Security Ticketing
          </h1>
          <p className="text-muted-foreground">
            Track, assign and manage security issues across your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedTickets}</div>
            </CardContent>
          </Card>
          <Card className={criticalTickets > 0 ? "border-red-500" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{criticalTickets}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className={selectedTicketData ? "w-full lg:w-2/3" : "w-full"}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={priorityFilter} 
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search tickets..." 
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="bg-secure hover:bg-secure-darker whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            <Card>
              <Tabs defaultValue="all">
                <CardHeader className="pb-0">
                  <CardTitle>Security Tickets</CardTitle>
                  <CardDescription className="pb-0">
                    <TabsList className="mt-2">
                      <TabsTrigger value="all">All Tickets</TabsTrigger>
                      <TabsTrigger value="open">Open</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    </TabsList>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No tickets found</h3>
                      <p className="text-muted-foreground mb-4">
                        No tickets match your current filter criteria.
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setPriorityFilter('all');
                      }}>
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="all" className="mt-0">
                        <TicketsTable 
                          tickets={filteredTickets} 
                          selectedTicketId={selectedTicket}
                          onSelectTicket={setSelectedTicket}
                        />
                      </TabsContent>
                      
                      <TabsContent value="open" className="mt-0">
                        <TicketsTable 
                          tickets={filteredTickets.filter(t => t.status === 'open')} 
                          selectedTicketId={selectedTicket}
                          onSelectTicket={setSelectedTicket}
                        />
                      </TabsContent>
                      
                      <TabsContent value="in-progress" className="mt-0">
                        <TicketsTable 
                          tickets={filteredTickets.filter(t => t.status === 'in_progress')} 
                          selectedTicketId={selectedTicket}
                          onSelectTicket={setSelectedTicket}
                        />
                      </TabsContent>
                      
                      <TabsContent value="pending" className="mt-0">
                        <TicketsTable 
                          tickets={filteredTickets.filter(t => t.status === 'pending')} 
                          selectedTicketId={selectedTicket}
                          onSelectTicket={setSelectedTicket}
                        />
                      </TabsContent>
                      
                      <TabsContent value="resolved" className="mt-0">
                        <TicketsTable 
                          tickets={filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed')} 
                          selectedTicketId={selectedTicket}
                          onSelectTicket={setSelectedTicket}
                        />
                      </TabsContent>
                    </>
                  )}
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {selectedTicketData && (
            <div className="w-full lg:w-1/3">
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <PriorityBadge priority={selectedTicketData.priority} />
                      <CardTitle className="mt-2">{selectedTicketData.title}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedTicket(null)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <StatusBadge status={selectedTicketData.status} />
                    <span>•</span>
                    <span>#{selectedTicketData.id}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedTicketData.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Category</div>
                      <div className="text-sm font-medium">{selectedTicketData.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Assignee</div>
                      <div className="text-sm font-medium">
                        {selectedTicketData.assignee || "Unassigned"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Reported By</div>
                      <div className="text-sm font-medium">{selectedTicketData.created_by}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Created On</div>
                      <div className="text-sm font-medium">
                        {new Date(selectedTicketData.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {selectedTicketData.due_date && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Due Date</div>
                        <div className="text-sm font-medium">
                          {new Date(selectedTicketData.due_date).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {selectedTicketData.related_assets && selectedTicketData.related_assets.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Related Assets</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTicketData.related_assets.map((assetId, index) => (
                          <Badge key={index} variant="outline">
                            {assetId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTicketData.related_cves && selectedTicketData.related_cves.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Related Vulnerabilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTicketData.related_cves.map((cveId, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className="border-red-500"
                          >
                            {cveId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="pt-2 space-y-2">
                    <Button className="w-full bg-secure hover:bg-secure-darker">
                      <ClipboardEdit className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

interface TicketsTableProps {
  tickets: any[];
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ tickets, selectedTicketId, onSelectTicket }) => {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No tickets found</h3>
        <p className="text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow 
            key={ticket.id}
            className={`cursor-pointer hover:bg-muted/50 ${selectedTicketId === ticket.id ? 'bg-muted' : ''}`}
            onClick={() => onSelectTicket(ticket.id)}
          >
            <TableCell className="font-medium">#{ticket.id.split('-')[1]}</TableCell>
            <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
            <TableCell>
              <PriorityBadge priority={ticket.priority} />
            </TableCell>
            <TableCell>
              <StatusBadge status={ticket.status} />
            </TableCell>
            <TableCell>
              {ticket.assignee || (
                <span className="text-muted-foreground text-sm">Unassigned</span>
              )}
            </TableCell>
            <TableCell>
              {new Date(ticket.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {ticket.due_date ? 
                new Date(ticket.due_date).toLocaleDateString() : 
                <span className="text-muted-foreground text-sm">No date</span>
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Open':
      return <Badge variant="outline">{status}</Badge>;
    case 'In Progress':
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          <Loader2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Pending':
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Resolved':
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Closed':
      return <Badge variant="secondary">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'Critical':
      return <Badge className="bg-red-600">{priority}</Badge>;
    case 'High':
      return <Badge className="bg-orange-500">{priority}</Badge>;
    case 'Medium':
      return <Badge className="bg-yellow-500 text-black">{priority}</Badge>;
    case 'Low':
      return <Badge className="bg-blue-500">{priority}</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export default TicketingPage;
