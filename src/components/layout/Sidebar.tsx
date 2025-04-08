
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AlertCircle, 
  Box, 
  ClipboardCheck, 
  FileText, 
  Settings, 
  Shield, 
  ShieldAlert,
  FilePlus,
  FileCheck,
  Users,
  Layout,
  BookOpen,
  Target,
  Briefcase,
  MonitorSmartphone,
  Database,
  CheckSquare,
  Sword,
  Radio,
  Ticket,
  Book,
  Server,
  Lock,
  Cog,
  Bot,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  Building,
  User,
  Globe
} from 'lucide-react';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Workspace = {
  id: string;
  name: string;
  type: 'personal' | 'team' | 'client';
};

const workspaces: Workspace[] = [
  { id: 'personal', name: 'Personal Workspace', type: 'personal' },
  { id: 'security-team', name: 'Security Team', type: 'team' },
  { id: 'acme-client', name: 'ACME Corporation', type: 'client' },
];

const favoritePages = [
  { name: 'Security Policies', path: '/documents/policies', icon: FileCheck },
  { name: 'Vulnerability Dashboard', path: '/dashboard/vulnerabilities', icon: ShieldAlert },
  { name: 'OWASP Top 10', path: '/knowledge-base/owasp', icon: Book },
];

const recentPages = [
  { name: 'Incident Response Plan', path: '/documents/incident-response', icon: FileText },
  { name: 'NIST Compliance', path: '/compliance/nist', icon: CheckSquare },
  { name: 'Asset Inventory', path: '/assets', icon: Database },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0].id);
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    recent: true,
    team: false
  });
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <SidebarContainer>
      <SidebarHeader className="flex flex-col gap-3 px-3 py-2">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-secure" />
          <span className="font-semibold">SecureCanvas</span>
        </div>
        
        <Select value={currentWorkspace} onValueChange={setCurrentWorkspace}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Workspaces</SelectLabel>
              {workspaces.map(workspace => (
                <SelectItem key={workspace.id} value={workspace.id} className="flex items-center gap-2">
                  {workspace.type === 'personal' && <User className="h-4 w-4" />}
                  {workspace.type === 'team' && <Users className="h-4 w-4" />}
                  {workspace.type === 'client' && <Building className="h-4 w-4" />}
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <Link to="/dashboard">
                    <Layout />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/documents') || location.pathname.startsWith('/document')}>
                  <Link to="/documents">
                    <FileText />
                    <span>Documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/templates')}>
                  <Link to="/templates">
                    <FileCheck />
                    <span>Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/knowledge-base')}>
                  <Link to="/knowledge-base">
                    <Book />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => toggleSection('favorites')}>
              {expandedSections.favorites ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </SidebarGroupAction>
          </div>
          {expandedSections.favorites && (
            <SidebarGroupContent>
              <SidebarMenu>
                {favoritePages.map((page) => (
                  <SidebarMenuItem key={page.path}>
                    <SidebarMenuButton asChild isActive={isActive(page.path)}>
                      <Link to={page.path}>
                        <page.icon className="h-4 w-4" />
                        <span>{page.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild variant="outline">
                    <Button variant="outline" className="w-full justify-center" size="sm">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      <span>Add Favorite</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        
        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => toggleSection('recent')}>
              {expandedSections.recent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </SidebarGroupAction>
          </div>
          {expandedSections.recent && (
            <SidebarGroupContent>
              <SidebarMenu>
                {recentPages.map((page) => (
                  <SidebarMenuItem key={page.path}>
                    <SidebarMenuButton asChild>
                      <Link to={page.path}>
                        <Clock className="h-4 w-4" />
                        <span>{page.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Security Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/soc')}>
                  <Link to="/soc">
                    <MonitorSmartphone />
                    <span>SOC</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/assets')}>
                  <Link to="/assets">
                    <Database />
                    <span>Assets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/compliance')}>
                  <Link to="/compliance">
                    <CheckSquare />
                    <span>Compliance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/ticketing')}>
                  <Link to="/ticketing">
                    <Ticket />
                    <span>Security Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/red-team')}>
                  <Link to="/red-team">
                    <Sword />
                    <span>Red Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/threat-intel')}>
                  <Link to="/threat-intel">
                    <Radio />
                    <span>Threat Intel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel>Team</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => toggleSection('team')}>
              {expandedSections.team ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </SidebarGroupAction>
          </div>
          {expandedSections.team && (
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <span>Alex Smith</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span>Jane Doe</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>MP</AvatarFallback>
                      </Avatar>
                      <span>Mike Peterson</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Professional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/learning')}>
                  <Link to="/learning">
                    <BookOpen />
                    <span>Learning Hub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/bug-bounty')}>
                  <Link to="/bug-bounty">
                    <Target />
                    <span>Bug Bounty</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/clients')}>
                  <Link to="/clients">
                    <Briefcase />
                    <span>Client Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/workspace-settings')}>
                  <Link to="/workspace-settings">
                    <Cog />
                    <span>Workspace Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/ai-config')}>
                  <Link to="/ai-config">
                    <Bot />
                    <span>AI Configuration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/profile')}>
              <Link to="/profile">
                <Users />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/settings')}>
              <Link to="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
