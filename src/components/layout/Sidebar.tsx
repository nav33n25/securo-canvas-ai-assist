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
  Globe,
  Sparkles,
  GraduationCap,
  Bug,
  HardDrive,
  ExternalLink
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
import { useAuth, UserRole } from '@/contexts/AuthContext';

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
  const { role } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0].id);
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    recent: true,
    team: false,
    extensions: false,
    specialized: false
  });
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if user has access to specific features based on role
  const hasAccess = (requiredRoles: UserRole[]) => {
    if (!role) return false;
    
    // Administrator can access everything
    if (role === 'administrator') return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.includes(role);
  };

  // Define menu items with required roles
  const menuItems = [
    {
      title: "Core",
      items: [
        {
          title: "Dashboard",
          icon: "dashboard",
          path: "/dashboard",
          roles: ["individual", "team_member", "team_manager", "administrator"]
        },
        {
          title: "Documents",
          icon: "documents",
          path: "/documents",
          roles: ["individual", "team_member", "team_manager", "administrator"]
        },
        {
          title: "Templates",
          icon: "templates",
          path: "/templates",
          roles: ["individual", "team_member", "team_manager", "administrator"]
        }
      ]
    },
    {
      title: "Security Modules",
      items: [
        {
          title: "Bug Bounty",
          icon: "bug",
          path: "/bug-bounty",
          roles: ["individual", "team_member", "team_manager", "administrator"]
        },
        {
          title: "Compliance",
          icon: "compliance",
          path: "/compliance",
          roles: ["team_member", "team_manager", "administrator"]
        },
        {
          title: "Asset Management",
          icon: "assets",
          path: "/assets",
          roles: ["team_member", "team_manager", "administrator"]
        },
        {
          title: "Threat Intelligence",
          icon: "threat",
          path: "/threat-intel",
          roles: ["team_member", "team_manager", "administrator"]
        },
        {
          title: "SOC Operations",
          icon: "security",
          path: "/soc",
          roles: ["team_member", "team_manager", "administrator"]
        },
        {
          title: "Red Team",
          icon: "redteam",
          path: "/red-team",
          roles: ["team_member", "team_manager", "administrator"]
        }
      ]
    },
    {
      title: "Learning & Resources",
      items: [
        {
          title: "Knowledge Base",
          icon: "knowledge",
          path: "/knowledge-base",
          roles: ["individual", "team_member", "team_manager", "administrator"]
        },
        {
          title: "Learning Hub",
          icon: "learning",
          path: "/learning",
          roles: ["individual", "team_member", "team_manager", "administrator"]
        },
        {
          title: "Client Portal",
          icon: "clients",
          path: "/clients",
          roles: ["individual", "team_manager", "administrator"]
        }
      ]
    },
    {
      title: "Administration",
      items: [
        {
          title: "Team Management",
          icon: "team",
          path: "/dashboard/team",
          roles: ["team_manager", "administrator"]
        },
        {
          title: "Workspace Settings",
          icon: "settings",
          path: "/workspace-settings",
          roles: ["administrator"]
        },
        {
          title: "AI Configuration",
          icon: "ai",
          path: "/ai-config",
          roles: ["team_manager", "administrator"]
        }
      ]
    }
  ];
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.map(section => {
    // Filter items based on role
    const filteredItems = section.items.filter(item => {
      // If no role is set or no roles are specified for the item, don't show it
      if (!role || !item.roles) return false;
      
      // Show if the user's role is in the item's allowed roles
      return item.roles.includes(role as UserRole);
    });
    
    // Only include sections that have visible items
    return {
      ...section,
      items: filteredItems,
      visible: filteredItems.length > 0
    };
  }).filter(section => section.visible);

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
        {/* Core Pages - Available to all users */}
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems[0].items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Extension Modules - Role-based access */}
        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel>Extension Modules</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => toggleSection('extensions')}>
              {expandedSections.extensions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </SidebarGroupAction>
          </div>
          {expandedSections.extensions && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems[1].items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        
        {/* Specialized Views */}
        <SidebarGroup>
          <div className="flex justify-between items-center">
            <SidebarGroupLabel>Specialized Views</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => toggleSection('specialized')}>
              {expandedSections.specialized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </SidebarGroupAction>
          </div>
          {expandedSections.specialized && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems[2].items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        
        {/* Favorites and Recent sections remain the same */}
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
        
        {/* Admin settings - Only for Administrators */}
        {filteredMenuItems[3].items.map((item) => (
          <SidebarGroup key={item.path}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <Link to="/profile">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
