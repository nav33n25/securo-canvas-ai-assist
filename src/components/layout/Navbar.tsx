
import React, { useState } from 'react';
import { 
  MenuIcon, 
  Moon, 
  Search, 
  Shield, 
  Sun, 
  User, 
  LogOut, 
  FileText, 
  FileCheck, 
  Bell,
  HelpCircle,
  Command,
  PlusSquare,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Critical Vulnerability',
    description: 'New CVE-2023-28771 affects your assets',
    time: '5m ago',
    read: false,
    type: 'alert'
  },
  {
    id: '2',
    title: 'Document Shared',
    description: 'Mike shared "Incident Response Plan" with you',
    time: '1h ago',
    read: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'Compliance Update',
    description: 'SOC2 audit requirements have been updated',
    time: '3h ago',
    read: true,
    type: 'info'
  },
  {
    id: '4',
    title: 'Scan Complete',
    description: 'Weekly vulnerability scan completed',
    time: '12h ago',
    read: true,
    type: 'success'
  }
];

const quickActions = [
  { name: 'New Document', icon: FileText, action: () => window.location.href = '/documents' },
  { name: 'New Template', icon: FileCheck, action: () => window.location.href = '/templates' },
  { name: 'New Security Ticket', icon: Bell, action: () => window.location.href = '/ticketing' },
  { name: 'Ask AI Assistant', icon: Sparkles, action: () => window.location.href = '/ai-config' }
];

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const userInitials = profile ? 
    `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` : 
    user?.email?.[0].toUpperCase() || 'U';

  return (
    <TooltipProvider>
      <header className="border-b sticky top-0 z-30 bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SidebarTrigger>
            <Link to="/" className="hidden md:flex items-center gap-2">
              <Shield className="h-6 w-6 text-secure" />
              <span className="font-semibold text-lg">SecureCanvas</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 px-8">
            <div className="max-w-md w-full mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents, assets, vulnerabilities..."
                className="w-full pl-10 pr-10"
                onClick={onOpenCommandPalette}
                readOnly
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-7 text-xs px-2 border rounded text-muted-foreground"
                onClick={onOpenCommandPalette}
              >
                <Command className="h-3 w-3 mr-1" />
                K
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost" 
              size="icon" 
              className="relative md:hidden" 
              onClick={onOpenCommandPalette}
            >
              <Command className="h-5 w-5" />
            </Button>
          
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <PlusSquare className="h-5 w-5" />
                      <span className="sr-only">Quick actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Quick actions</TooltipContent>
              </Tooltip>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {quickActions.map(action => (
                  <DropdownMenuItem key={action.name} onClick={action.action} className="cursor-pointer">
                    <action.icon className="mr-2 h-4 w-4" />
                    <span>{action.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            <Sheet>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                          {unreadNotifications}
                        </Badge>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              
              <SheetContent className="w-[400px] sm:w-[540px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <Button variant="outline" size="sm">Mark all as read</Button>
                </div>
                
                <div className="space-y-4">
                  {mockNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border rounded-lg ${!notification.read ? 'bg-accent/50' : ''}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-start gap-2">
                          {notification.type === 'alert' && (
                            <div className="h-2 w-2 mt-2 rounded-full bg-red-500" />
                          )}
                          {notification.type === 'info' && (
                            <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                          )}
                          {notification.type === 'success' && (
                            <div className="h-2 w-2 mt-2 rounded-full bg-green-500" />
                          )}
                          <div>
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toast({
                    title: 'Help Center',
                    description: 'The help center is currently being developed.',
                  })}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help Center</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help Center</TooltipContent>
            </Tooltip>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || user.email || ''} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}` 
                          : user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/documents" className="flex w-full cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Documents</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/templates" className="flex w-full cursor-pointer">
                      <FileCheck className="mr-2 h-4 w-4" />
                      <span>Templates</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Navbar;
