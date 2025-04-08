
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets, getCveData } from '@/services/securityDataService';
import { Asset, CveEntry } from '@/types/security';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Search, 
  Shield, 
  AlertOctagon, 
  Server, 
  Laptop, 
  Smartphone, 
  Router, 
  Globe, 
  Package, 
  Cog,
  Plus,
  RefreshCw,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Map asset type to icon
const getAssetIcon = (type: string) => {
  switch (type) {
    case 'Server':
      return <Server className="h-4 w-4" />;
    case 'Workstation':
      return <Laptop className="h-4 w-4" />;
    case 'Mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'Network':
      return <Router className="h-4 w-4" />;
    case 'Service':
      return <Globe className="h-4 w-4" />;
    case 'Application':
      return <Package className="h-4 w-4" />;
    default:
      return <Cog className="h-4 w-4" />;
  }
};

const AssetsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets
  });
  
  const { data: vulnerabilities = [], isLoading: vulnsLoading } = useQuery({
    queryKey: ['vulnerabilities'],
    queryFn: getCveData
  });
  
  // Apply filters
  const filteredAssets = assets
    .filter(asset => {
      if (searchQuery) {
        return asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               (asset.owner && asset.owner.toLowerCase().includes(searchQuery.toLowerCase())) || 
               (asset.ip_address && asset.ip_address.includes(searchQuery));
      }
      return true;
    })
    .filter(asset => typeFilter === 'all' || asset.type === typeFilter)
    .filter(asset => criticalityFilter === 'all' || asset.criticality === criticalityFilter);

  // Get counts for dashboard statistics
  const serverCount = assets.filter(a => a.type === 'Server').length;
  const workstationCount = assets.filter(a => a.type === 'Workstation').length;
  const applicationCount = assets.filter(a => a.type === 'Application').length;
  const networkCount = assets.filter(a => a.type === 'Network').length;
  
  const criticalCount = assets.filter(a => a.criticality === 'Critical').length;
  const highCount = assets.filter(a => a.criticality === 'High').length;
  
  // Calculate average security score
  const avgSecurityScore = assets.length > 0 ? 
    assets.reduce((sum, asset) => sum + asset.security_score, 0) / assets.length : 
    0;
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8 text-secure" />
            Assets & Vulnerabilities
          </h1>
          <p className="text-muted-foreground">
            Manage your digital assets and monitor associated vulnerabilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Assets</CardTitle>
              <CardDescription>All managed assets</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between">
                <div className="text-3xl font-bold">{assets.length}</div>
                <div className="flex gap-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Server className="h-3 w-3" /> {serverCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> {workstationCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" /> {applicationCount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Critical Assets</CardTitle>
              <CardDescription>High business impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">
                {Math.round(criticalCount / assets.length * 100)}% of total assets
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Security Score</CardTitle>
              <CardDescription>Average across all assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={avgSecurityScore} className="h-2" />
              <div className="text-xl font-bold">{Math.round(avgSecurityScore)}/100</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vulnerabilities</CardTitle>
              <CardDescription>Open across all assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-baseline">
                <div className="text-3xl font-bold">
                  {assets.reduce((sum, asset) => sum + asset.vulnerabilities.length, 0)}
                </div>
                <div className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {vulnerabilities.filter(v => v.severity === 'Critical').length} critical
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className={selectedAsset ? "w-full md:w-2/3" : "w-full"}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Select 
                  value={typeFilter} 
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Server">Servers</SelectItem>
                    <SelectItem value="Workstation">Workstations</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Service">Services</SelectItem>
                    <SelectItem value="Application">Applications</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={criticalityFilter} 
                  onValueChange={setCriticalityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by criticality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Criticality</SelectItem>
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
                    placeholder="Search assets..." 
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button className="bg-secure hover:bg-secure-darker">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </div>

            <Card>
              <Tabs defaultValue="assets" className="w-full">
                <CardHeader className="pb-0">
                  <CardTitle>Asset Inventory</CardTitle>
                  <CardDescription className="pb-0">
                    <TabsList className="mt-2">
                      <TabsTrigger value="assets">All Assets ({filteredAssets.length})</TabsTrigger>
                      <TabsTrigger value="vulnerable">Vulnerable Assets ({filteredAssets.filter(a => a.vulnerabilities.length > 0).length})</TabsTrigger>
                      <TabsTrigger value="secure">Secure Assets ({filteredAssets.filter(a => a.vulnerabilities.length === 0).length})</TabsTrigger>
                    </TabsList>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assetsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                    </div>
                  ) : filteredAssets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Database className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No assets found</h3>
                      <p className="text-muted-foreground mb-4">
                        No assets match your current filter criteria.
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('');
                        setTypeFilter('all');
                        setCriticalityFilter('all');
                      }}>
                        Reset Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="assets" className="mt-0">
                        <AssetsTable 
                          assets={filteredAssets} 
                          vulnerabilities={vulnerabilities}
                          onSelect={setSelectedAsset}
                          selectedId={selectedAsset?.id}
                        />
                      </TabsContent>
                      
                      <TabsContent value="vulnerable" className="mt-0">
                        <AssetsTable 
                          assets={filteredAssets.filter(a => a.vulnerabilities.length > 0)} 
                          vulnerabilities={vulnerabilities}
                          onSelect={setSelectedAsset}
                          selectedId={selectedAsset?.id}
                        />
                      </TabsContent>
                      
                      <TabsContent value="secure" className="mt-0">
                        <AssetsTable 
                          assets={filteredAssets.filter(a => a.vulnerabilities.length === 0)} 
                          vulnerabilities={vulnerabilities}
                          onSelect={setSelectedAsset}
                          selectedId={selectedAsset?.id}
                        />
                      </TabsContent>
                    </>
                  )}
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {selectedAsset && (
            <div className="w-full md:w-1/3">
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getAssetIcon(selectedAsset.type)}
                      <CardTitle>{selectedAsset.name}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedAsset(null)}
                    >
                      <AlertOctagon className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Badge 
                      className={
                        selectedAsset.criticality === 'Critical' ? 'bg-red-600' :
                        selectedAsset.criticality === 'High' ? 'bg-orange-500' :
                        selectedAsset.criticality === 'Medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }
                    >
                      {selectedAsset.criticality} Criticality
                    </Badge>
                    <Badge variant="outline">
                      {selectedAsset.type}
                    </Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Security Score</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedAsset.security_score} className="h-2 flex-1" />
                      <span className="font-medium">{selectedAsset.security_score}/100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedAsset.ip_address && (
                      <div>
                        <h3 className="text-xs text-muted-foreground mb-1">IP Address</h3>
                        <p className="text-sm font-medium">{selectedAsset.ip_address}</p>
                      </div>
                    )}
                    {selectedAsset.mac_address && (
                      <div>
                        <h3 className="text-xs text-muted-foreground mb-1">MAC Address</h3>
                        <p className="text-sm font-medium">{selectedAsset.mac_address}</p>
                      </div>
                    )}
                    {selectedAsset.os && (
                      <div>
                        <h3 className="text-xs text-muted-foreground mb-1">Operating System</h3>
                        <p className="text-sm font-medium">{selectedAsset.os}</p>
                      </div>
                    )}
                    {selectedAsset.location && (
                      <div>
                        <h3 className="text-xs text-muted-foreground mb-1">Location</h3>
                        <p className="text-sm font-medium">{selectedAsset.location}</p>
                      </div>
                    )}
                    {selectedAsset.owner && (
                      <div>
                        <h3 className="text-xs text-muted-foreground mb-1">Owner</h3>
                        <p className="text-sm font-medium">{selectedAsset.owner}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs text-muted-foreground mb-1">Last Scan</h3>
                      <p className="text-sm font-medium">{new Date(selectedAsset.last_scan).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Vulnerabilities</h3>
                      <Badge>{selectedAsset.vulnerabilities.length}</Badge>
                    </div>

                    {selectedAsset.vulnerabilities.length === 0 ? (
                      <div className="flex items-center justify-center p-4 border rounded-md bg-muted/20 text-center">
                        <div>
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm">No vulnerabilities detected</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedAsset.vulnerabilities.map(vulnId => {
                          const vuln = vulnerabilities.find(v => v.id === vulnId);
                          return vuln ? (
                            <div 
                              key={vulnId} 
                              className={`text-sm p-2 rounded border ${
                                vuln.severity === 'Critical' ? 'border-red-600' :
                                vuln.severity === 'High' ? 'border-orange-500' :
                                vuln.severity === 'Medium' ? 'border-yellow-500' :
                                'border-blue-500'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="font-medium">{vuln.id}</div>
                                <Badge 
                                  className={
                                    vuln.severity === 'Critical' ? 'bg-red-600' :
                                    vuln.severity === 'High' ? 'bg-orange-500' :
                                    vuln.severity === 'Medium' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                  }
                                >
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <p className="mt-1 text-muted-foreground line-clamp-2">
                                {vuln.description}
                              </p>
                              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                <span>CVSS: {vuln.cvss_score}</span>
                                <span>Status: {vuln.status}</span>
                              </div>
                            </div>
                          ) : (
                            <div key={vulnId} className="text-sm p-2 rounded border">
                              {vulnId} (Details unavailable)
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2 space-y-2">
                    <Button className="bg-secure hover:bg-secure-darker w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Run Security Scan
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Security History
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

interface AssetsTableProps {
  assets: Asset[];
  vulnerabilities: CveEntry[];
  onSelect: (asset: Asset) => void;
  selectedId?: string;
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets, vulnerabilities, onSelect, selectedId }) => {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No assets found</h3>
        <p className="text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  // Function to get the highest severity from an asset's vulnerabilities
  const getHighestSeverity = (asset: Asset) => {
    if (asset.vulnerabilities.length === 0) return null;
    
    const sevs = asset.vulnerabilities.map(vulnId => {
      const vuln = vulnerabilities.find(v => v.id === vulnId);
      return vuln ? vuln.severity : null;
    }).filter(Boolean) as string[];
    
    if (sevs.includes('Critical')) return 'Critical';
    if (sevs.includes('High')) return 'High';
    if (sevs.includes('Medium')) return 'Medium';
    if (sevs.includes('Low')) return 'Low';
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Criticality</TableHead>
          <TableHead>Security Score</TableHead>
          <TableHead>Vulnerabilities</TableHead>
          <TableHead>Last Scan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => {
          const highestSeverity = getHighestSeverity(asset);
          
          return (
            <TableRow 
              key={asset.id} 
              className={`cursor-pointer hover:bg-muted/50 ${selectedId === asset.id ? 'bg-muted' : ''}`}
              onClick={() => onSelect(asset)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getAssetIcon(asset.type)}
                  <span>{asset.name}</span>
                </div>
              </TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    asset.criticality === 'Critical' ? 'bg-red-600' :
                    asset.criticality === 'High' ? 'bg-orange-500' :
                    asset.criticality === 'Medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }
                >
                  {asset.criticality}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={asset.security_score} className="h-2 w-16" />
                  <span>{asset.security_score}</span>
                </div>
              </TableCell>
              <TableCell>
                {asset.vulnerabilities.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{asset.vulnerabilities.length}</span>
                    {highestSeverity && (
                      <Badge 
                        className={
                          highestSeverity === 'Critical' ? 'bg-red-600' :
                          highestSeverity === 'High' ? 'bg-orange-500' :
                          highestSeverity === 'Medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }
                      >
                        {highestSeverity}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Badge variant="outline" className="text-green-500 border-green-500">Secure</Badge>
                )}
              </TableCell>
              <TableCell>{new Date(asset.last_scan).toLocaleDateString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AssetsPage;
