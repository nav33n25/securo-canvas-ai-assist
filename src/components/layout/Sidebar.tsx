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
import { IconType } from '@/types/common';

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
  { name: 'Security Policies', path: '/documents/policies', icon: FileCheck, iconComponent: FileCheck },
  { name: 'Vulnerability Dashboard', path: '/dashboard/vulnerabilities', icon: ShieldAlert, iconComponent: ShieldAlert },
  { name: 'OWASP Top 10', path: '/knowledge-base/owasp', icon: Book, iconComponent: Book },
];

const recentPages = [
  { name: 'Incident Response Plan', path: '/documents/incident-response', icon: FileText, iconComponent: FileText },
  { name: 'NIST Compliance', path: '/compliance/nist', icon: CheckSquare, iconComponent: CheckSquare },
  { name: 'Asset Inventory', path: '/assets', icon: Database, iconComponent: Database },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  dashboard: Layout,
  documents: FileText,
  templates: FileCheck,
  bug: Bug,
  compliance: ClipboardCheck,
  assets: HardDrive,
  threat: Globe,
  security: MonitorSmartphone,
  redteam: Sword,
  knowledge: Book,
  learning: GraduationCap,
  clients: ExternalLink,
  team: Users,
  settings: Settings,
  ai: Sparkles
};

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

  const hasAccess = (requiredRoles: UserRole[]) => {
    if (!role) return false;
    
    if (role === 'administrator') return true;
    
    return requiredRoles.includes(role);
  };

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

  const filteredMenuItems = menuItems.map(section => {
    const filteredItems = section.items.filter(item => {
      if (!role || !item.roles) return false;
      
      return item.roles.includes(role as UserRole);
    }).map(item => ({
      ...item,
      iconComponent: iconMap[item.icon] || FileText
    }));
    
    return {
      ...section,
      items: filteredItems,
      visible: filteredItems.length > 0
    };
  }).filter(section => section.visible);

  const coreMenuItems = [
    {
      title: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
      iconComponent: Layout
    },
    {
      title: "Documents",
      icon: "documents",
      path: "/documents",
      iconComponent: FileText
    }
  ];

  const getCoreItems = () => {
    if (filteredMenuItems.length === 0 || !filteredMenuItems[0]?.items) {
      return coreMenuItems;
    }
    return filteredMenuItems[0].items;
  };

  const getExtensionItems = () => {
    if (filteredMenuItems.length < 2 || !filteredMenuItems[1]?.items) {
      return [];
    }
    return filteredMenuItems[1].items;
  };

  const getSpecializedItems = () => {
    if (filteredMenuItems.length < 3 || !filteredMenuItems[2]?.items) {
      return [];
    }
    return filteredMenuItems[2].items;
  };

  const getAdminItems = () => {
    if (filteredMenuItems.length < 4 || !filteredMenuItems[3]?.items) {
      return [];
    }
    return filteredMenuItems[3].items;
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
              {getCoreItems().map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.iconComponent className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {getExtensionItems().length > 0 && (
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
                  {getExtensionItems().map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link to={item.path}>
                          <item.iconComponent className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}
        
        {getSpecializedItems().length > 0 && (
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
                  {getSpecializedItems().map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link to={item.path}>
                          <item.iconComponent className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}
        
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
                        <page.iconComponent className="h-4 w-4" />
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
        
        {getAdminItems().map((item) => (
          <SidebarGroup key={item.path}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.iconComponent className="h-4 w-4" />
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
