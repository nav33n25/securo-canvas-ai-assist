import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, LogOut, User, Settings, ChevronDown, Users2, PersonStanding, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '../auth/RoleSelection';

const UserMenu = () => {
  const { user, profile, signOut, role, setUserRole } = useAuth();
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const navigate = useNavigate();

  if (!user || !profile) return null;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || '??';
  };

  // Get full name or email
  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user.email || 'User';
  };

  // Format role for display
  const formatRole = (role: UserRole | null | undefined) => {
    if (!role) return 'User';
    return role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  // Get icon for current role
  const getRoleIcon = () => {
    switch (role) {
      case 'individual':
        return <PersonStanding className="h-4 w-4 mr-2" />;
      case 'team_member':
        return <Users2 className="h-4 w-4 mr-2" />;
      case 'team_manager':
        return <Shield className="h-4 w-4 mr-2" />;
      case 'administrator':
        return <UserCog className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:block text-right mr-2">
        <p className="text-sm font-medium">{getDisplayName()}</p>
        <p className="text-xs text-muted-foreground flex items-center justify-end">
          {getRoleIcon()}
          {formatRole(role)}
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url || ''} alt={getDisplayName()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Switch Role</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Switch User Role</DialogTitle>
                  <DialogDescription>
                    Change your role to access different features of the platform
                  </DialogDescription>
                </DialogHeader>
                <RoleSelection />
              </DialogContent>
            </Dialog>
            <DropdownMenuItem onClick={() => navigate('/workspace-settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu; 