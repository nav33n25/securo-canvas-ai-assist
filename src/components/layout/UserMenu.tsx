
import React from 'react';
import { useAuth, UserRole, SubscriptionPlan } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
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
import { 
  Shield, 
  LogOut, 
  User, 
  Settings, 
  Users2, 
  PersonStanding, 
  UserCog,
  CreditCard,
  Star,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '../auth/RoleSelection';
import { Badge } from '../ui/badge';

// Define plan display information
const planInfo: Record<SubscriptionPlan, { label: string, color: string, icon: React.ReactNode }> = {
  'free': { 
    label: 'Free Plan', 
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
    icon: <Shield className="h-4 w-4 mr-2" />
  },
  'pro': { 
    label: 'Pro Plan', 
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
    icon: <Star className="h-4 w-4 mr-2" /> 
  },
  'team': { 
    label: 'Team Plan', 
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200', 
    icon: <Users2 className="h-4 w-4 mr-2" /> 
  },
  'enterprise': { 
    label: 'Enterprise Plan', 
    color: 'bg-amber-100 text-amber-800 hover:bg-amber-200', 
    icon: <Crown className="h-4 w-4 mr-2" /> 
  }
};

const UserMenu = () => {
  const { user, profile, signOut, role, subscriptionPlan, setUserPlan } = useAuth();
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
      case 'individual_basic':
      case 'individual_professional':
        return <PersonStanding className="h-4 w-4 mr-2" />;
      case 'team_member':
      case 'team_analyst':
      case 'team_hunter':
      case 'team_researcher':
      case 'team_red':
      case 'team_blue':
        return <Users2 className="h-4 w-4 mr-2" />;
      case 'team_lead':
      case 'team_manager':
      case 'security_manager':
      case 'ciso_director':
        return <Shield className="h-4 w-4 mr-2" />;
      case 'administrator':
      case 'knowledge_admin':
      case 'platform_admin':
        return <UserCog className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };
  
  // Handle plan upgrade
  const handlePlanChange = async (plan: SubscriptionPlan) => {
    if (subscriptionPlan === plan) return;
    await setUserPlan(plan);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:block text-right mr-2">
        <p className="text-sm font-medium">{getDisplayName()}</p>
        <div className="text-xs text-muted-foreground flex items-center justify-end gap-2">
          {getRoleIcon()}
          {formatRole(role)}
          
          {/* Show subscription badge */}
          {subscriptionPlan && (
            <Badge variant="outline" className={`ml-1 text-xs px-1 ${
              planInfo[subscriptionPlan]?.color || ''
            }`}>
              {planInfo[subscriptionPlan]?.icon}
              <span className="text-xs">{subscriptionPlan}</span>
            </Badge>
          )}
        </div>
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
              {subscriptionPlan && (
                <Badge variant="outline" className={`w-fit mt-1 ${
                  planInfo[subscriptionPlan]?.color || ''
                }`}>
                  {planInfo[subscriptionPlan]?.icon}
                  {planInfo[subscriptionPlan]?.label}
                </Badge>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Subscription Plan</span>
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">DEV</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                    In development mode - no payment required
                  </div>
                  <DropdownMenuItem 
                    onClick={() => handlePlanChange('free')}
                    disabled={subscriptionPlan === 'free'}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Free Plan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handlePlanChange('pro')}
                    disabled={subscriptionPlan === 'pro'}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    <span>Professional ($19/month)</span>
                    <span className="ml-auto text-[10px] text-green-600">Free in dev</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handlePlanChange('team')}
                    disabled={subscriptionPlan === 'team'}
                  >
                    <Users2 className="mr-2 h-4 w-4" />
                    <span>Team ($49/month)</span>
                    <span className="ml-auto text-[10px] text-green-600">Free in dev</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handlePlanChange('enterprise')}
                    disabled={subscriptionPlan === 'enterprise'}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Enterprise ($99/month)</span>
                    <span className="ml-auto text-[10px] text-green-600">Free in dev</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
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
