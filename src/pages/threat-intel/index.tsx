
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getThreatIntelFeeds, getMitreAttackData } from '@/services/securityDataService';
import { ThreatIntelFeed } from '@/types/security';
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
  Radio,
  Search,
  AlertTriangle,
  Globe,
  Calendar,
  Radar,
  RefreshCw,
  Target,
  ArrowUpRight,
  AlertCircle,
  Link as LinkIcon,
  Hash
} from 'lucide-react';

const ThreatIntelPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<ThreatIntelFeed | null>(null);
  
  const { data: threats = [], isLoading } = useQuery({
    queryKey: ['threatIntel'],
    queryFn: getThreatIntelFeeds
  });
  
  const { data: mitreTechniques = [] } = useQuery({
    queryKey: ['mitreTechniques'],
    queryFn: getMitreAttackData
  });
  
  // Apply filters
  const filteredThreats = threats
    .filter(threat => {
      if (searchQuery) {
        return threat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               threat.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(threat => severityFilter === 'all' || threat.severity === severityFilter);
  
  // Get counts by severity for dashboard metrics
  const criticalCount = threats.filter(t => t.severity === 'Critical').length;
  const highCount = threats.filter(t => t.severity === 'High').length;
  const mediumCount = threats.filter(t => t.severity === 'Medium').length;
  const lowCount = threats.filter(t => t.severity === 'Low').length;
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Radio className="h-8 w-8 text-secure" />
            Threat Intelligence Hub
          </h1>
          <p className="text-muted-foreground">
            Stay informed about the latest security threats, vulnerabilities and threat actor campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={criticalCount > 0 ? "border-red-600" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Critical Threats
                {criticalCount > 0 && <AlertCircle className="h-5 w-5 text-red-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{criticalCount}</div>
            </CardContent>
          </Card>
          <Card className={highCount > 0 ? "border-orange-500" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">High Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{highCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Medium/Low Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mediumCount + lowCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Intelligence Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">
                Active feeds from trusted sources
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className={selectedThreat ? "w-full md:w-2/3" : "w-full"}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
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

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search threats..." 
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" aria-label="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card>
              <Tabs defaultValue="threats">
                <CardHeader className="pb-0">
                  <CardTitle>Intelligence Feeds</CardTitle>
                  <CardDescription className="pb-0">
                    <TabsList className="mt-2">
                      <TabsTrigger value="threats">Latest Threats</TabsTrigger>
                      <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
                      <TabsTrigger value="indicators">Indicators (IOCs)</TabsTrigger>
                    </TabsList>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                    </div>
                  ) : filteredThreats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Radio className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No threats found</h3>
                      <p className="text-muted-foreground mb-4">
                        No threats match your current filter criteria.
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('');
                        setSeverityFilter('all');
                      }}>
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="threats" className="mt-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Date Published</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredThreats.map((threat) => (
                              <TableRow 
                                key={threat.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => setSelectedThreat(threat)}
                              >
                                <TableCell className="font-medium">
                                  {threat.title}
                                </TableCell>
                                <TableCell>
                                  <ThreatSeverityBadge severity={threat.severity} />
                                </TableCell>
                                <TableCell>{threat.source}</TableCell>
                                <TableCell>
                                  {new Date(threat.published_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedThreat(threat);
                                    }}
                                  >
                                    Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="campaigns" className="mt-0">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Radar className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">Campaign Tracking</h3>
                          <p className="text-muted-foreground mb-4">
                            This feature will be available in the next phase of development.
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="indicators" className="mt-0">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Hash className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">Indicators of Compromise</h3>
                          <p className="text-muted-foreground mb-4">
                            This feature will be available in the next phase of development.
                          </p>
                        </div>
                      </TabsContent>
                    </>
                  )}
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {selectedThreat && (
            <div className="w-full md:w-1/3">
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <ThreatSeverityBadge severity={selectedThreat.severity} />
                      <CardTitle className="mt-2">{selectedThreat.title}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedThreat(null)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Globe className="h-4 w-4" />
                    <span>{selectedThreat.source}</span>
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>{new Date(selectedThreat.published_date).toLocaleDateString()}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedThreat.description}
                  </p>

                  {selectedThreat.affected_systems && selectedThreat.affected_systems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Affected Systems</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedThreat.affected_systems.map((system, index) => (
                          <Badge key={index} variant="outline">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {selectedThreat.indicators && selectedThreat.indicators.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Indicators of Compromise (IOCs)</h3>
                      <div className="space-y-2">
                        {selectedThreat.indicators.map((indicator, index) => (
                          <div 
                            key={index}
                            className="text-sm p-2 border rounded flex justify-between items-center"
                          >
                            <span>{indicator}</span>
                            <Button variant="ghost" size="icon" aria-label="Copy">
                              <LinkIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedThreat.mitre_techniques && selectedThreat.mitre_techniques.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">MITRE ATT&CK Techniques</h3>
                      <div className="space-y-2">
                        {selectedThreat.mitre_techniques.map(techId => {
                          const technique = mitreTechniques.find(t => t.id === techId);
                          return technique ? (
                            <div 
                              key={techId} 
                              className="text-sm p-2 border rounded"
                            >
                              <div className="flex justify-between items-start">
                                <div className="font-medium">{technique.id}: {technique.name}</div>
                                <Badge>{technique.tactic}</Badge>
                              </div>
                            </div>
                          ) : (
                            <div 
                              key={techId} 
                              className="text-sm p-2 border rounded"
                            >
                              {techId}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="pt-2 space-y-2">
                    <Button className="w-full bg-secure hover:bg-secure-darker">
                      <Target className="h-4 w-4 mr-2" />
                      Check Your Exposure
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      View Original Report
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

interface ThreatSeverityBadgeProps {
  severity: string;
}

const ThreatSeverityBadge: React.FC<ThreatSeverityBadgeProps> = ({ severity }) => {
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

export default ThreatIntelPage;
