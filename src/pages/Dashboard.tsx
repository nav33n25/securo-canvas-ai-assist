
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  Compass,
  CheckCircle2,
  ArrowRight,
  LinkIcon,
  Sword,
  Radio,
  BarChart3,
  Clock
} from 'lucide-react';

import { ActivityItem, fetchActivityFeed } from '@/services/activityService';
import { RecentDocument, fetchRecentDocuments } from '@/services/documentService';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RecentDocumentsSection from '@/components/dashboard/RecentDocumentsSection';
import QuickAccessWidgets, { DashboardWidget } from '@/components/dashboard/QuickAccessWidgets';
import UserRoleCard from '@/components/dashboard/UserRoleCard';
import AllModulesGrid from '@/components/dashboard/AllModulesGrid';
import WelcomeSection from '@/components/dashboard/WelcomeSection';

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
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRecentDocuments = async () => {
      if (!user) {
        setIsLoadingDocuments(false);
        return;
      }
      
      try {
        setIsLoadingDocuments(true);
        const documents = await fetchRecentDocuments(user.id);
        setRecentDocuments(documents);
      } catch (err) {
        console.error('Error loading recent documents:', err);
        setError('Failed to load recent documents');
      } finally {
        setIsLoadingDocuments(false);
      }
    };
    
    loadRecentDocuments();
  }, [user]);
  
  useEffect(() => {
    const loadActivityFeed = async () => {
      if (!user) {
        setIsLoadingActivities(false);
        return;
      }
      
      try {
        setIsLoadingActivities(true);
        const activities = await fetchActivityFeed(user.id);
        setActivities(activities);
      } catch (err) {
        console.error('Error loading activity feed:', err);
        setError('Failed to load activity feed');
      } finally {
        setIsLoadingActivities(false);
      }
    };
    
    loadActivityFeed();
  }, [user]);
  
  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-md">
            <p className="text-red-700">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <WelcomeSection firstName={profile?.first_name} role={role} />
        
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
