import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
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
  Link,
  Sword,
  Radio,
  BarChart3
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

// Define different dashboard widgets based on user roles
interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  link: string;
  requiredRoles: UserRole[];
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
    icon: Link,
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    link: '/clients',
    requiredRoles: ['individual', 'team_manager', 'administrator']
  }
];

const Dashboard: React.FC = () => {
  const { role, profile } = useAuth();
  
  // Filter widgets based on user role
  const filteredWidgets = dashboardWidgets.filter(widget => {
    if (!role) return false;
    
    // If user is administrator, show all widgets
    if (role === 'administrator') return true;
    
    // Otherwise, check if the user's role is in the widget's required roles
    return widget.requiredRoles.includes(role);
  });
  
  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Get user's display name
  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    
    return 'there';
  };
  
  // Get role-specific welcome message
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                  <RouterLink to={widget.link}>
                    <span>Open</span>
                    <ArrowRight className="h-4 w-4" />
                  </RouterLink>
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* Create New Document card - available to all users */}
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
                <RouterLink to="/documents?new=true">
                  <span>Create</span>
                  <ArrowRight className="h-4 w-4" />
                </RouterLink>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Quick Stats - show based on role */}
        {role && ['team_member', 'team_manager', 'administrator'].includes(role) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-4 dark:bg-green-900/30">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-red-100 rounded-full p-2 mr-4 dark:bg-red-900/30">
                    <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vulnerabilities</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 dark:bg-blue-900/30">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance</p>
                    <p className="text-2xl font-bold">86%</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="bg-amber-100 rounded-full p-2 mr-4 dark:bg-amber-900/30">
                    <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Assessment</p>
                    <p className="text-2xl font-bold">12d</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Admin-specific section */}
        {role === 'administrator' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Administration</h2>
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Monitor the overall status of your SecureCanvas instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="text-3xl font-bold">18</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Teams</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Storage</p>
                    <p className="text-3xl font-bold">42%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">API Usage</p>
                    <p className="text-3xl font-bold">67%</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <RouterLink to="/workspace-settings">
                    Manage Workspace
                  </RouterLink>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
