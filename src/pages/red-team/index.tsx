
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRedTeamOperations, getMitreAttackData } from '@/services/securityDataService';
import { RedTeamOperation, MitreAttackTechnique } from '@/types/security';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sword,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Plus,
  File,
  FileText
} from 'lucide-react';

const RedTeamPage = () => {
  const [selectedOperation, setSelectedOperation] = useState<RedTeamOperation | null>(null);
  
  const { data: operations = [], isLoading: opsLoading } = useQuery({
    queryKey: ['redTeamOperations'],
    queryFn: getRedTeamOperations
  });

  const { data: mitreTechniques = [] } = useQuery({
    queryKey: ['mitreTechniques'],
    queryFn: getMitreAttackData
  });

  // Calculate statistics
  const activeOps = operations.filter(op => op.status === 'Active').length;
  const plannedOps = operations.filter(op => op.status === 'Planning').length;
  const completedOps = operations.filter(op => op.status === 'Completed').length;
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sword className="h-8 w-8 text-secure" />
            Red Team Operations
          </h1>
          <p className="text-muted-foreground">
            Plan, execute and report on offensive security operations to test your defenses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeOps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Planned Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{plannedOps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedOps}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Success Rate</CardTitle>
              <CardDescription>Objective achievement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={85} className="h-2" />
              <div className="text-xl font-bold">85%</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Operations</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-secure hover:bg-secure-darker">
                <Plus className="h-4 w-4 mr-2" />
                New Operation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Red Team Operation</DialogTitle>
                <DialogDescription>
                  Create a new offensive security operation plan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-muted-foreground">
                  This feature will be implemented in the next phase.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <Tabs defaultValue="all">
            <CardHeader className="pb-0">
              <TabsList className="mb-1">
                <TabsTrigger value="all">All Operations</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              {opsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="mt-0">
                    <OperationsTable 
                      operations={operations} 
                      onSelect={setSelectedOperation}
                    />
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-0">
                    <OperationsTable 
                      operations={operations.filter(op => op.status === 'Active')} 
                      onSelect={setSelectedOperation}
                    />
                  </TabsContent>
                  
                  <TabsContent value="planning" className="mt-0">
                    <OperationsTable 
                      operations={operations.filter(op => op.status === 'Planning')} 
                      onSelect={setSelectedOperation}
                    />
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-0">
                    <OperationsTable 
                      operations={operations.filter(op => op.status === 'Completed')} 
                      onSelect={setSelectedOperation}
                    />
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Tabs>
        </Card>

        {selectedOperation && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="h-5 w-5 text-secure" />
                    {selectedOperation.name}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <StatusBadge status={selectedOperation.status} />
                    <span>
                      Started on {new Date(selectedOperation.start_date).toLocaleDateString()}
                    </span>
                    {selectedOperation.end_date && (
                      <span>
                        • Ended on {new Date(selectedOperation.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedOperation(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Objective</h3>
                    <p className="text-muted-foreground">{selectedOperation.objective}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Targeted Systems</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOperation.targeted_systems.map((system, index) => (
                        <div 
                          key={index} 
                          className="p-2 rounded-md border bg-muted/50 text-sm"
                        >
                          {system}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Attack Techniques</h3>
                    <div className="space-y-3">
                      {selectedOperation.techniques.map(techId => {
                        const technique = mitreTechniques.find(t => t.id === techId);
                        return technique ? (
                          <div key={techId} className="rounded-md border p-3">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">{technique.id}: {technique.name}</h4>
                              <Badge>{technique.tactic}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{technique.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Platforms: {technique.platforms.join(', ')}
                            </div>
                          </div>
                        ) : (
                          <div key={techId} className="rounded-md border p-3">
                            <h4 className="font-medium">{techId}</h4>
                            <p className="text-sm text-muted-foreground">Technique details unavailable</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {selectedOperation.results && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Results</h3>
                        <p className="text-muted-foreground">{selectedOperation.results}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Operation Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span>
                            {selectedOperation.status === 'Completed' ? '100%' : 
                             selectedOperation.status === 'Active' ? '60%' : '20%'}
                          </span>
                        </div>
                        <Progress 
                          value={
                            selectedOperation.status === 'Completed' ? 100 : 
                            selectedOperation.status === 'Active' ? 60 : 20
                          } 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Start Date</div>
                          <div className="text-sm font-medium">
                            {new Date(selectedOperation.start_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">End Date</div>
                          <div className="text-sm font-medium">
                            {selectedOperation.end_date ? 
                              new Date(selectedOperation.end_date).toLocaleDateString() : 
                              'In Progress'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Actions</h3>
                    <Button className="w-full bg-secure hover:bg-secure-darker">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <File className="h-4 w-4 mr-2" />
                      View Documents
                    </Button>
                    {selectedOperation.status !== 'Completed' && (
                      <Button variant="outline" className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

interface OperationsTableProps {
  operations: RedTeamOperation[];
  onSelect: (operation: RedTeamOperation) => void;
}

const OperationsTable: React.FC<OperationsTableProps> = ({ operations, onSelect }) => {
  if (operations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Sword className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No operations found</h3>
        <p className="text-muted-foreground">No operations match your current filter criteria.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Operation Name</TableHead>
          <TableHead>Objective</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operations.map((operation) => (
          <TableRow 
            key={operation.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelect(operation)}
          >
            <TableCell className="font-medium">{operation.name}</TableCell>
            <TableCell className="max-w-xs truncate">{operation.objective}</TableCell>
            <TableCell><StatusBadge status={operation.status} /></TableCell>
            <TableCell>{new Date(operation.start_date).toLocaleDateString()}</TableCell>
            <TableCell>
              {operation.end_date ? new Date(operation.end_date).toLocaleDateString() : '-'}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(operation);
                }}
              >
                Details
                <ChevronRight className="h-4 w-4 ml-1" />
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
      return (
        <Badge className="bg-green-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Planning':
      return <Badge variant="outline">{status}</Badge>;
    case 'Completed':
      return (
        <Badge className="bg-blue-500 flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Cancelled':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default RedTeamPage;
