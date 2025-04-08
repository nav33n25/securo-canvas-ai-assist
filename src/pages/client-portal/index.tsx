
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/services/securityDataService';
import { Client } from '@/types/security';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Search, 
  UserPlus, 
  FileText, 
  ChevronRight,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

const ClientPortalPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  const filteredClients = searchQuery 
    ? clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contact_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clients;

  const activeClients = filteredClients.filter(client => client.status === 'Active');
  const prospectClients = filteredClients.filter(client => client.status === 'Prospect');
  const inactiveClients = filteredClients.filter(client => client.status === 'Inactive');

  // Calculate project statistics
  const allProjects = clients.flatMap(client => client.projects);
  const completedProjects = allProjects.filter(project => project.status === 'Completed').length;
  const inProgressProjects = allProjects.filter(project => project.status === 'In Progress').length;
  const planningProjects = allProjects.filter(project => project.status === 'Planning').length;

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-secure" />
            Client Portal
          </h1>
          <p className="text-muted-foreground">
            Manage your security consulting clients and projects in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Clients</CardTitle>
              <CardDescription>Current client relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeClients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Projects</CardTitle>
              <CardDescription>Projects currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inProgressProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Project Completion</CardTitle>
              <CardDescription>Overall progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={completedProjects / allProjects.length * 100} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {completedProjects} of {allProjects.length} projects completed
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search clients..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-secure hover:bg-secure-darker">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Clients ({filteredClients.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeClients.length})</TabsTrigger>
              <TabsTrigger value="prospects">Prospects ({prospectClients.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveClients.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <ClientsTable clients={filteredClients} />
            </TabsContent>
            
            <TabsContent value="active" className="mt-4">
              <ClientsTable clients={activeClients} />
            </TabsContent>
            
            <TabsContent value="prospects" className="mt-4">
              <ClientsTable clients={prospectClients} />
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-4">
              <ClientsTable clients={inactiveClients} />
            </TabsContent>
          </Tabs>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allProjects.slice(0, 4).map(project => (
              <Card key={project.id} className="hover:border-secure cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <StatusBadge status={project.status} />
                  </div>
                  <CardDescription>
                    Client: {clients.find(c => c.id === project.client_id)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Started {new Date(project.start_date).toLocaleDateString()}
                  </div>
                  <Button variant="ghost" size="sm" className="text-secure">
                    Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No clients found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your search or add a new client.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Contact Person</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.industry}</TableCell>
            <TableCell>
              <div>{client.contact_name}</div>
              <div className="text-sm text-muted-foreground">{client.contact_email}</div>
            </TableCell>
            <TableCell>
              <StatusBadge status={client.status} />
            </TableCell>
            <TableCell>{client.projects.length}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                View
              </Button>
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
    case 'Active':
      return <Badge className="bg-green-500">{status}</Badge>;
    case 'Inactive':
      return <Badge variant="secondary">{status}</Badge>;
    case 'Prospect':
      return <Badge className="bg-blue-500">{status}</Badge>;
    case 'Completed':
      return (
        <Badge className="bg-green-500 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'In Progress':
      return (
        <Badge className="bg-blue-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Planning':
      return <Badge variant="outline">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default ClientPortalPage;
