
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
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
  Compass,
  CheckCircle2,
  ArrowRight,
  LinkIcon,
  Sword,
  Radio,
  BarChart3,
  Clock
} from 'lucide-react';

import ActivityFeed, { ActivityItem } from '@/components/dashboard/ActivityFeed';
import RecentDocumentsSection, { RecentDocument } from '@/components/dashboard/RecentDocumentsSection';
import QuickAccessWidgets, { DashboardWidget } from '@/components/dashboard/QuickAccessWidgets';
import UserRoleCard from '@/components/dashboard/UserRoleCard';
import AllModulesGrid from '@/components/dashboard/AllModulesGrid';

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
          let firstName = '';
          let lastName = '';
          
          // Fix for TS18047: Add proper null checking for item.profiles
          if (item.profiles && 
              typeof item.profiles === 'object' && 
              item.profiles !== null && 
              !('error' in item.profiles)) {
            // Extract profile data with proper type assertion
            const profileData = item.profiles as { first_name?: string; last_name?: string };
            firstName = profileData.first_name || '';
            lastName = profileData.last_name || '';
          }
          
          return {
            id: item.id,
            type: 'document_updated',
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
            <ActivityFeed 
              activities={activities} 
              isLoading={isLoadingActivities} 
            />
            
            <RecentDocumentsSection 
              documents={recentDocuments} 
              isLoading={isLoadingDocuments} 
            />
          </div>
          
          <div className="space-y-6">
            <QuickAccessWidgets 
              widgets={dashboardWidgets} 
              role={role} 
            />
            
            <UserRoleCard role={role} />
          </div>
        </div>
        
        <div className="mt-8">
          <AllModulesGrid 
            widgets={dashboardWidgets} 
            role={role} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
