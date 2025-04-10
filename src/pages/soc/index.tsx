import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSocAlerts, getAssets, getMitreAttackData } from '@/services/securityDataService';
import { SocAlert } from '@/types/security';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  MonitorSmartphone, 
  AlertCircle, 
  Search, 
  Shield, 
  BarChart3,
  Clock,
  Filter,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hourglass
} from 'lucide-react';

const SOCPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<SocAlert | null>(null);
  
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['socAlerts'],
    queryFn: getSocAlerts
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets
  });

  const { data: mitreTechniques = [] } = useQuery({
    queryKey: ['mitreTechniques'],
    queryFn: getMitreAttackData
  });

  const filteredAlerts = alerts
    .filter(alert => {
      if (searchQuery) {
        return alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               alert.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(alert => severityFilter === 'all' || alert.severity === severityFilter)
    .filter(alert => statusFilter === 'all' || alert.status === statusFilter);

  // Get counts by severity and status for dashboard metrics
  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;
  const highCount = alerts.filter(a => a.severity === 'High').length;
  const mediumCount = alerts.filter(a => a.severity === 'Medium').length;
  const lowCount = alerts.filter(a => a.severity === 'Low').length;

  const newCount = alerts.filter(a => a.status === 'New').length;
  const investigatingCount = alerts.filter(a => a.status === 'Investigating').length;
  const containedCount = alerts.filter(a => a.status === 'Contained').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;
  
  const getTechniqueName = (techniqueId: string) => {
    if (!mitreTechniques) return techniqueId;
    
    if (Array.isArray(mitreTechniques)) {
      const technique = mitreTechniques.find(t => t.id === techniqueId);
      return technique ? technique.name : techniqueId;
    } else if (mitreTechniques.techniques) {
      const technique = mitreTechniques.techniques.find(t => t.id === techniqueId);
      return technique ? technique.name : techniqueId;
    }
    
    return techniqueId;
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MonitorSmartphone className="h-8 w-8 text-secure" />
            Security Operations Center
          </h1>
          <p className="text-muted-foreground">
            Monitor security events, investigate alerts and respond to incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={criticalCount > 0 ? "border-red-600" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Critical Alerts
                {criticalCount > 0 && <AlertCircle className="h-5 w-5 text-red-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{criticalCount}</div>
            </CardContent>
          </Card>
          <Card className={highCount > 0 ? "border-orange-500" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">High Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{highCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{investigatingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Response Time</CardTitle>
              <CardDescription>Average time to respond</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">14m 32s</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className={selectedAlert ? "w-full md:w-2/3" : "w-full"}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Select 
                  value={severityFilter} 
                  onValueChange={setSeverityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Investigating">Investigating</SelectItem>
                    <SelectItem value="Contained">Contained</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="False Positive">False Positive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search alerts..." 
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button className="bg-secure hover:bg-secure-darker">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>
                  Showing {filteredAlerts.length} of {alerts.length} total alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No alerts found</h3>
                    <p className="text-muted-foreground mb-4">
                      No alerts match your current filter criteria.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery('');
                      setSeverityFilter('all');
                      setStatusFilter('all');
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alert</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Time Detected</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlerts.map((alert) => (
                        <TableRow 
                          key={alert.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          <TableCell className="font-medium">{alert.title}</TableCell>
                          <TableCell>
                            <AlertSeverityBadge severity={alert.severity} />
                          </TableCell>
                          <TableCell>
                            <AlertStatusBadge status={alert.status} />
                          </TableCell>
                          <TableCell>{alert.source}</TableCell>
                          <TableCell>
                            {new Date(alert.detected_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAlert(alert);
                              }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedAlert && (
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="pr-8">{selectedAlert.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedAlert(null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <AlertSeverityBadge severity={selectedAlert.severity} />
                    <AlertStatusBadge status={selectedAlert.status} />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedAlert.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Source</h3>
                    <p className="text-sm text-muted-foreground">{selectedAlert.source}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Timeline</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Detected:</span>
                        <span>{new Date(selectedAlert.detected_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{new Date(selectedAlert.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {selectedAlert.affected_assets && selectedAlert.affected_assets.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Affected Assets</h3>
                      <div className="space-y-1">
                        {selectedAlert.affected_assets.map(assetId => {
                          const asset = assets.find(a => a.id === assetId);
                          return (
                            <div key={assetId} className="text-sm px-3 py-2 rounded bg-muted">
                              {asset ? asset.name : assetId}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedAlert.mitre_techniques && selectedAlert.mitre_techniques.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">MITRE ATT&CK Techniques</h3>
                      <div className="space-y-1">
                        {selectedAlert.mitre_techniques.map(techniqueId => {
                          const technique = getTechniqueName(techniqueId);
                          return (
                            <div key={techniqueId} className="text-sm px-3 py-2 rounded bg-muted">
                              {technique}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Response Actions</h3>
                    <div className="flex flex-col gap-2">
                      <Button className="bg-secure hover:bg-secure-darker justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Escalate Alert
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark as False Positive
                      </Button>
                    </div>
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

interface AlertSeverityBadgeProps {
  severity: string;
}

const AlertSeverityBadge: React.FC<AlertSeverityBadgeProps> = ({ severity }) => {
  switch (severity) {
    case 'Critical':
      return <Badge className="bg-red-600">{severity}</Badge>;
    case 'High':
      return <Badge className="bg-orange-500">{severity}</Badge>;
    case 'Medium':
      return <Badge className="bg-yellow-500 text-black">{severity}</Badge>;
    case 'Low':
      return <Badge className="bg-blue-500">{severity}</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
};

interface AlertStatusBadgeProps {
  status: string;
}

const AlertStatusBadge: React.FC<AlertStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'New':
      return <Badge variant="outline" className="border-red-500 text-red-500">{status}</Badge>;
    case 'Investigating':
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          <Hourglass className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'Contained':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">{status}</Badge>;
    case 'Resolved':
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case 'False Positive':
      return <Badge variant="outline">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default SOCPage;
