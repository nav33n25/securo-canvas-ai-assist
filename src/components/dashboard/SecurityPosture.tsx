
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle2, 
  CircleDashed, 
  Info, 
  Server, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Wifi 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const riskScoreData = [
  { name: 'Low Risk', value: 60, color: '#10B981' },
  { name: 'Medium Risk', value: 30, color: '#F59E0B' },
  { name: 'High Risk', value: 10, color: '#EF4444' },
];

const assetTypeData = [
  { name: 'Servers', count: 42, secure: 38, vulnerable: 4, icon: Server },
  { name: 'Endpoints', count: 156, secure: 132, vulnerable: 24, icon: Wifi },
  { name: 'Applications', count: 37, secure: 28, vulnerable: 9, icon: Shield },
];

const complianceData = [
  { name: 'SOC 2', value: 92 },
  { name: 'ISO 27001', value: 78 },
  { name: 'NIST CSF', value: 85 },
  { name: 'GDPR', value: 72 },
  { name: 'HIPAA', value: 64 },
];

const vulnerabilityData = [
  { name: 'Critical', count: 3 },
  { name: 'High', count: 12 },
  { name: 'Medium', count: 27 },
  { name: 'Low', count: 41 },
];

const SecurityPostureDashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Security Posture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Overall Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskScoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                    72/100
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-muted-foreground pt-0">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span>High</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Updated 3 days ago
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Vulnerabilities by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vulnerabilityData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6E59A5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>3 critical vulnerabilities need immediate attention</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Asset Security Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetTypeData.map((asset) => (
                <div key={asset.name} className="flex items-center gap-4">
                  <div className="bg-secondary p-2 rounded-full">
                    <asset.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">Total: {asset.count}</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                          <span className="text-xs">{asset.secure}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                          <span className="text-xs">{asset.vulnerable}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-1.5 w-full bg-secondary rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(asset.secure / asset.count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityPostureDashboard;
