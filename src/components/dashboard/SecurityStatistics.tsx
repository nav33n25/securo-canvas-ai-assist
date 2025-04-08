
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';

const SecurityStatistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-threat">
            <AlertTriangle className="h-4 w-4 mr-2" /> 
            Active Vulnerabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">
              <div className="bg-threat/10 text-threat px-2 py-1 rounded">+3 this week</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Critical</span>
              <span className="font-medium">3</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-threat h-1 rounded-full" style={{ width: '25%' }}></div>
            </div>
            
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">High</span>
              <span className="font-medium">5</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-threat/70 h-1 rounded-full" style={{ width: '42%' }}></div>
            </div>
            
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">Medium</span>
              <span className="font-medium">4</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-threat/40 h-1 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-safe">
            <CheckCircle className="h-4 w-4 mr-2" /> 
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-bold">86%</div>
            <div className="text-xs text-muted-foreground">
              <div className="bg-safe/10 text-safe px-2 py-1 rounded">+5% from last audit</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">ISO 27001</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-safe h-1 rounded-full" style={{ width: '92%' }}></div>
            </div>
            
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">NIST CSF</span>
              <span className="font-medium">83%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-safe/70 h-1 rounded-full" style={{ width: '83%' }}></div>
            </div>
            
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">SOC 2</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-safe/60 h-1 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-info">
            <Info className="h-4 w-4 mr-2" />
            Asset Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">48</div>
          <div className="text-xs text-muted-foreground mt-1">Total tracked assets</div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="border rounded p-2">
              <div className="text-sm font-medium">Servers</div>
              <div className="text-2xl font-semibold">15</div>
            </div>
            <div className="border rounded p-2">
              <div className="text-sm font-medium">Endpoints</div>
              <div className="text-2xl font-semibold">23</div>
            </div>
            <div className="border rounded p-2">
              <div className="text-sm font-medium">Cloud</div>
              <div className="text-2xl font-semibold">6</div>
            </div>
            <div className="border rounded p-2">
              <div className="text-sm font-medium">Network</div>
              <div className="text-2xl font-semibold">4</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center text-warning">
            <Clock className="h-4 w-4 mr-2" />
            Upcoming Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">8</div>
          <div className="text-xs text-muted-foreground mt-1">Tasks due this week</div>
          
          <div className="mt-4 space-y-2">
            <div className="border-l-2 border-warning pl-3 py-1">
              <div className="text-sm font-medium">Security Patch Deployment</div>
              <div className="text-xs text-muted-foreground">Due in 2 days</div>
            </div>
            <div className="border-l-2 border-warning pl-3 py-1">
              <div className="text-sm font-medium">Firewall Ruleset Review</div>
              <div className="text-xs text-muted-foreground">Due in 3 days</div>
            </div>
            <div className="border-l-2 border-warning pl-3 py-1">
              <div className="text-sm font-medium">Access Control Audit</div>
              <div className="text-xs text-muted-foreground">Due in 5 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityStatistics;
