
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  CalendarDays, 
  FileText, 
  PlusCircle, 
  Users, 
  Shield,
  ShieldAlert,
  Bug,
  Database,
  BookOpen,
  LucideIcon,
  Compass,
  CheckCircle2,
  ArrowRight,
  LinkIcon,
  Sword,
  Radio,
  BarChart3,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  link: string;
  requiredRoles: UserRole[];
}

interface RecentDocument {
  id: string;
  title: string;
  updated_at: string;
  status: string;
}

interface ActivityItem {
  id: string;
  type: 'document_created' | 'document_updated' | 'comment_added' | 'role_changed' | 'joined';
  document_id?: string;
  document_title?: string;
  user_id: string;
  user_name?: string;
  created_at: string;
  content?: string;
}

interface DocumentVersionResponse {
  id: string;
  created_at: string;
  change_summary: string | null;
  document_id: string;
  documents: {
    title: string | null;
  } | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null | { error: true };
}

const dashboardWidgets: DashboardWidget[] = [
  {
    id: 'documents',
    title: 'Security Documents',
    description: 'Create and manage security documentation',
    icon: FileText,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    link: '/documents',
    requiredRoles: ['individual', 'team_member', 'team_manager', 'administrator']
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Use pre-built security document templates',
    icon: FileText,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    link: '/templates',
    requiredRoles: ['individual', 'team_member', 'team_manager', 'administrator']
  },
  {
    id: 'bug_bounty',
    title: 'Bug Bounty',
    description: 'Manage vulnerability reports and findings',
    icon: Bug,
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    link: '/bug-bounty',
    requiredRoles: ['individual', 'team_member', 'team_manager', 'administrator']
  },
  {
    id: 'learning',
    title: 'Learning Hub',
    description: 'Security training and educational resources',
    icon: BookOpen,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    link: '/learning',
    requiredRoles: ['individual', 'team_member', 'team_manager', 'administrator']
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'Manage security compliance frameworks',
    icon: CheckCircle2,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    link: '/compliance',
    requiredRoles: ['team_member', 'team_manager', 'administrator']
  },
  {
    id: 'assets',
    title: 'Asset Management',
    description: 'Track and monitor digital assets',
    icon: Database,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    link: '/assets',
    requiredRoles: ['team_member', 'team_manager', 'administrator']
  },
  {
    id: 'team_dashboard',
    title: 'Team Dashboard',
    description: 'Overview of your security team activities',
    icon: Users,
    color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    link: '/dashboard/team',
    requiredRoles: ['team_manager', 'administrator']
  },
  {
    id: 'security_posture',
    title: 'Security Posture',
    description: 'Monitor your organization\'s security status',
    icon: Shield,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    link: '/dashboard/security',
    requiredRoles: ['team_member', 'team_manager', 'administrator']
  },
  {
    id: 'red_team',
    title: 'Red Team Operations',
    description: 'Plan and track offensive security activities',
    icon: Sword,
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    link: '/red-team',
    requiredRoles: ['team_member', 'team_manager', 'administrator']
  },
  {
    id: 'threat_intel',
    title: 'Threat Intelligence',
    description: 'Track security threats and vulnerabilities',
    icon: Radio,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    link: '/threat-intel',
    requiredRoles: ['team_member', 'team_manager', 'administrator']
  },
  {
    id: 'workspace_settings',
    title: 'Workspace Settings',
    description: 'Manage workspace configuration and users',
    icon: Compass,
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    link: '/workspace-settings',
    requiredRoles: ['administrator']
  },
  {
    id: 'client_portal',
    title: 'Client Portal',
    description: 'Manage client relationships and deliverables',
    icon: LinkIcon,
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    link: '/clients',
    requiredRoles: ['individual', 'team_manager', 'administrator']
  }
];

const Dashboard: React.FC = () => {
  const { role, profile, user } = useAuth();
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  
  const filteredWidgets = dashboardWidgets.filter(widget => {
    if (!role) return false;
    
    if (role === 'administrator') return true;
    
    return widget.requiredRoles.includes(role);
  });
  
  useEffect(() => {
    const fetchRecentDocuments = async () => {
      if (!user) return;
      
      try {
        setIsLoadingDocuments(true);
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, updated_at, status')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setRecentDocuments(data || []);
      } catch (error) {
        console.error('Error fetching recent documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };
    
    fetchRecentDocuments();
  }, [user]);
  
  useEffect(() => {
    const fetchActivityFeed = async () => {
      if (!user) return;
      
      try {
        setIsLoadingActivities(true);
        
        const { data, error } = await supabase
          .from('document_versions')
          .select(`
            id, 
            created_at, 
            change_summary,
            document_id,
            documents(title),
            profiles(first_name, last_name)
          `)
          .limit(10)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const transformedActivities: ActivityItem[] = (data || []).map(item => {
          // Handle the case where item.profiles could be null
          const profilesObj = item.profiles && typeof item.profiles === 'object' ? 
            (item.profiles === null ? { first_name: null, last_name: null } : 
            ('error' in item.profiles ? { first_name: null, last_name: null } : item.profiles)) : 
            { first_name: null, last_name: null };
          
          const firstName = profilesObj.first_name || '';
          const lastName = profilesObj.last_name || '';
          
          return {
            id: item.id,
            type: 'document_updated' as const,
            document_id: item.document_id,
            document_title: item.documents?.title || 'Untitled Document',
            user_id: user.id,
            user_name: `${firstName} ${lastName}`.trim(),
            created_at: item.created_at,
            content: item.change_summary || 'Updated document'
          };
        });
        
        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching activity feed:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };
    
    fetchActivityFeed();
  }, [user]);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    
    return 'there';
  };
  
  const getWelcomeMessage = () => {
    switch(role) {
      case 'individual':
        return 'Welcome to your personal security workspace';
      case 'team_member':
        return 'Access tools to support your security team';
      case 'team_manager':
        return 'Manage your security team and resources';
      case 'administrator':
        return 'Administer the SecureCanvas platform';
      default:
        return 'Welcome to SecureCanvas';
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            {getGreeting()}, {getDisplayName()}
          </h1>
          <p className="text-muted-foreground">
            {getWelcomeMessage()}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start pb-4 border-b last:border-0">
                        <div className="flex-shrink-0 mr-4">
                          <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{activity.user_name || 'A user'}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.content} in <Link to={`/document/${activity.document_id}`} className="text-secure hover:underline">{activity.document_title}</Link>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent activity to display</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/documents">
                    View All Documents
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDocuments ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : recentDocuments.length > 0 ? (
                  <div className="divide-y">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="py-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Last updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/document/${doc.id}`}>
                            <span>Open</span>
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No documents found</p>
                    <Button className="mt-4" asChild>
                      <Link to="/documents?new=true">
                        Create Your First Document
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/documents">
                      All Documents
                    </Link>
                  </Button>
                  <Button className="flex-1 bg-secure hover:bg-secure-darker" asChild>
                    <Link to="/documents?new=true">
                      New Document
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Shortcuts to important tools</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {filteredWidgets.slice(0, 6).map(widget => (
                  <Button key={widget.id} variant="outline" className="justify-start h-auto py-3" asChild>
                    <Link to={widget.link} className="flex items-center">
                      <div className={`mr-3 p-2 rounded-md ${widget.color}`}>
                        <widget.icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{widget.title}</div>
                        <div className="text-xs text-muted-foreground">{widget.description}</div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-secure hover:bg-secure-darker" asChild>
                  <Link to="/documents?new=true">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Document
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {role && (
              <Card>
                <CardHeader>
                  <CardTitle>Your SecureCanvas Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-secure/10">
                      {role === 'individual' && <Users className="h-6 w-6 text-secure" />}
                      {role === 'team_member' && <Shield className="h-6 w-6 text-secure" />}
                      {role === 'team_manager' && <ShieldAlert className="h-6 w-6 text-secure" />}
                      {role === 'administrator' && <Compass className="h-6 w-6 text-secure" />}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {role === 'individual' && 'Individual'}
                        {role === 'team_member' && 'Team Member'}
                        {role === 'team_manager' && 'Team Manager'}
                        {role === 'administrator' && 'Administrator'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {role === 'individual' && 'Personal security workspace'}
                        {role === 'team_member' && 'Collaborate with your security team'}
                        {role === 'team_manager' && 'Manage your team and resources'}
                        {role === 'administrator' && 'Full platform administration'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile">
                      Manage Your Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">All Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map(widget => (
              <Card key={widget.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-md ${widget.color}`}>
                      <widget.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{widget.title}</CardTitle>
                  <CardDescription>{widget.description}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link to={widget.link}>
                      <span>Open</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-md bg-secure/10 text-secure">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">Create New Document</CardTitle>
                <CardDescription>Start a new security document from scratch</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full justify-between bg-secure hover:bg-secure-darker" asChild>
                  <Link to="/documents?new=true">
                    <span>Create</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
