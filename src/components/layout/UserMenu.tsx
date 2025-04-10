
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole, SubscriptionPlan } from '@/contexts/AuthContext';
import {
  User,
  LogOut,
  UserCircle,
  Settings,
  CreditCard,
  LucideIcon,
  Shield,
  Users,
  PersonStanding,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface RoleOption {
  value: UserRole;
  label: string;
  icon: LucideIcon;
  requiresPlan?: SubscriptionPlan;
}

const roleOptions: RoleOption[] = [
  {
    value: 'individual',
    label: 'Individual',
    icon: PersonStanding,
  },
  {
    value: 'team_member',
    label: 'Team Member',
    icon: User,
    requiresPlan: 'pro',
  },
  {
    value: 'team_manager',
    label: 'Team Manager',
    icon: Users,
    requiresPlan: 'team',
  },
  {
    value: 'administrator',
    label: 'Administrator',
    icon: Shield,
    requiresPlan: 'enterprise',
  },
];

const UserMenu: React.FC = () => {
  const { user, profile, role, subscriptionPlan, setUserRole, signOut } = useAuth();
  const [isChangingRole, setIsChangingRole] = useState(false);

  const userDisplayName = profile 
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() 
    : user?.email?.split('@')[0] || 'User';
    
  const userInitials = profile 
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}` 
    : user?.email?.[0].toUpperCase() || 'U';

  const handleRoleChange = async (newRole: UserRole) => {
    setIsChangingRole(true);
    try {
      await setUserRole(newRole);
    } catch (error) {
      console.error('Failed to change role:', error);
    } finally {
      setIsChangingRole(false);
    }
  };

  const canUseRole = (roleOption: RoleOption): boolean => {
    if (!roleOption.requiresPlan) return true;
    
    // Map subscription plans to a hierarchy level
    const planLevels: Record<SubscriptionPlan, number> = {
      'free': 0,
      'pro': 1,
      'team': 2,
      'enterprise': 3
    };
    
    const currentPlanLevel = planLevels[subscriptionPlan || 'free'];
    const requiredPlanLevel = planLevels[roleOption.requiresPlan];
    
    return currentPlanLevel >= requiredPlanLevel;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatarUrl} alt={userDisplayName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userDisplayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
              <DropdownMenuShortcut>
                <Badge variant="outline" className="ml-2 px-1 py-0 text-xs">
                  {subscriptionPlan === 'free' 
                    ? 'Free' 
                    : subscriptionPlan === 'pro' 
                      ? 'Pro' 
                      : subscriptionPlan === 'team' 
                        ? 'Team' 
                        : 'Enterprise'}
                </Badge>
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/ai-config">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Assistant
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ChevronDown className="mr-2 h-4 w-4" />
            <span>Role: {role ? roleOptions.find(r => r.value === role)?.label : 'User'}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-[220px]">
            <DropdownMenuRadioGroup value={role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
              {roleOptions.map((roleOption) => {
                const isAvailable = canUseRole(roleOption);
                return (
                  <DropdownMenuRadioItem
                    key={roleOption.value}
                    value={roleOption.value}
                    disabled={!isAvailable || isChangingRole}
                    className={!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    <roleOption.icon className="mr-2 h-4 w-4" />
                    {roleOption.label}
                    {roleOption.requiresPlan && !isAvailable && (
                      <Badge variant="outline" className="ml-auto px-1 py-0 text-xs">
                        {roleOption.requiresPlan.charAt(0).toUpperCase() + roleOption.requiresPlan.slice(1)}+
                      </Badge>
                    )}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
