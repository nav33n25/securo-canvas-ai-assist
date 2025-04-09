import React from 'react';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, PersonStanding, UserCog, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  role: UserRole;
  onSelect: (role: UserRole) => void;
  isSelected: boolean;
  disabled?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  title, 
  description, 
  icon, 
  role, 
  onSelect,
  isSelected,
  disabled = false
}) => (
  <Card 
    className={`transition-all ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer hover:shadow-md'
    } ${
      isSelected ? 'ring-2 ring-secure bg-secure/5' : ''
    }`}
    onClick={() => !disabled && onSelect(role)}
  >
    <CardContent className="p-4 flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        isSelected ? 'bg-secure text-white' : 'bg-muted'
      }`}>
        {icon}
      </div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {disabled && (
        <p className="text-xs text-red-500 mt-2">Not available in your current plan</p>
      )}
    </CardContent>
  </Card>
);

interface RoleSelectionProps {
  initialRole?: UserRole | null;
  onRoleSelect?: (role: UserRole) => void;
  showContinueButton?: boolean;
  allowedRoles?: UserRole[];
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ 
  initialRole, 
  onRoleSelect, 
  showContinueButton = true,
  allowedRoles = ['individual', 'team_member', 'team_manager', 'administrator']
}) => {
  const { setUserRole, role: currentRole } = useAuth();
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(initialRole || currentRole);
  const navigate = useNavigate();

  const roles: {
    title: string;
    description: string;
    icon: React.ReactNode;
    role: UserRole;
  }[] = [
    {
      title: 'Individual',
      description: 'Students, bug bounty hunters, independent consultants',
      icon: <PersonStanding className="h-6 w-6" />,
      role: 'individual'
    },
    {
      title: 'Team Member',
      description: 'Security professionals working within organizations',
      icon: <Users className="h-6 w-6" />,
      role: 'team_member'
    },
    {
      title: 'Team Manager',
      description: 'Security team leaders, CISO, security managers',
      icon: <Shield className="h-6 w-6" />,
      role: 'team_manager'
    },
    {
      title: 'Administrator',
      description: 'Platform administrators managing the instance',
      icon: <UserCog className="h-6 w-6" />,
      role: 'administrator'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    if (onRoleSelect) {
      onRoleSelect(role);
    }
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    await setUserRole(selectedRole);
    navigate('/dashboard');
  };

  // Ensure the selected role is available in the current plan
  React.useEffect(() => {
    if (selectedRole && !allowedRoles.includes(selectedRole)) {
      // If current selection is not allowed, default to the highest allowed role
      const highestAllowedRole = [...allowedRoles].pop();
      if (highestAllowedRole) {
        setSelectedRole(highestAllowedRole);
        if (onRoleSelect) {
          onRoleSelect(highestAllowedRole);
        }
      }
    }
  }, [allowedRoles, selectedRole, onRoleSelect]);

  return (
    <div className="space-y-6">
      {!initialRole && (
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
          <p className="text-muted-foreground">
            Choose the role that best describes your security work
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((roleOption) => {
          const isRoleAllowed = allowedRoles.includes(roleOption.role);
          
          return (
            <RoleCard
              key={roleOption.role}
              title={roleOption.title}
              description={roleOption.description}
              icon={roleOption.icon}
              role={roleOption.role}
              onSelect={handleRoleSelect}
              isSelected={selectedRole === roleOption.role}
              disabled={!isRoleAllowed}
            />
          );
        })}
      </div>

      {showContinueButton && (
        <div className="flex justify-end">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            className="px-6"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoleSelection; 