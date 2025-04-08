
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityStatistics from '@/components/dashboard/SecurityStatistics';
import DocumentsList from '@/components/dashboard/DocumentsList';
import { Shield, AlertCircle, Clock, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Dashboard activity feed types
type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  icon: React.ElementType;
};

// Mock activity feed data
const recentActivity: ActivityItem[] = [
  { 
    id: '1',
    user: 'John Smith',
    action: 'created document',
    target: 'SOC 2 Compliance Report',
    timestamp: '10 minutes ago',
    icon: Shield
  },
  { 
    id: '2',
    user: 'Maria Garcia',
    action: 'commented on',
    target: 'Incident Response Procedure',
    timestamp: '1 hour ago',
    icon: AlertCircle
  },
  { 
    id: '3',
    user: 'David Chen',
    action: 'updated asset',
    target: 'AWS Production Environment',
    timestamp: '3 hours ago',
    icon: Clock
  },
  { 
    id: '4',
    user: 'Sarah Johnson',
    action: 'shared document with',
    target: 'Security Team',
    timestamp: '5 hours ago',
    icon: Users
  }
];

// Mock AI suggested content
const aiSuggestions = [
  { 
    id: '1', 
    title: 'Complete your Threat Model', 
    description: 'Your application security assessment is missing threat modeling documentation',
    progress: 30
  },
  { 
    id: '2', 
    title: 'Update Security Controls', 
    description: 'NIST framework has been updated with new controls',
    progress: 0
  },
  { 
    id: '3', 
    title: 'Review High Severity CVEs', 
    description: '3 new high severity vulnerabilities affect your assets',
    progress: 10
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.first_name || 'Security Professional';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{timeOfDay()}, {firstName}</h1>
            <p className="text-muted-foreground">
              Here's what's happening in your security workspace today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/documents')}>
              Create Document
            </Button>
            <Button variant="outline" onClick={() => navigate('/assets')}>
              Manage Assets
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <SecurityStatistics />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest activity across your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="mt-0.5">
                          <div className="bg-secondary rounded-full p-1.5">
                            <activity.icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>AI Suggestions</CardTitle>
                      <CardDescription>Personalized recommendations</CardDescription>
                    </div>
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiSuggestions.map(suggestion => (
                      <div key={suggestion.id} className="space-y-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{suggestion.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {suggestion.progress > 0 ? `${suggestion.progress}% complete` : 'Not started'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                        <div className="h-1.5 w-full bg-secondary rounded-full mt-1">
                          <div 
                            className="h-full bg-secure rounded-full" 
                            style={{ width: `${suggestion.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Documents you've recently worked with</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Security Tasks</CardTitle>
                <CardDescription>Assigned and recommended security tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The security tasks section is currently being developed and will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
