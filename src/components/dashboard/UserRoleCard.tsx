
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Shield, ShieldAlert, Compass } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

interface UserRoleCardProps {
  role: UserRole | null;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ role }) => {
  if (!role) return null;
  
  const getRoleIcon = () => {
    switch (role) {
      case 'individual': return <Users className="h-6 w-6 text-secure" />;
      case 'team_member': return <Shield className="h-6 w-6 text-secure" />;
      case 'team_manager': return <ShieldAlert className="h-6 w-6 text-secure" />;
      case 'administrator': return <Compass className="h-6 w-6 text-secure" />;
      default: return <Users className="h-6 w-6 text-secure" />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'individual': return 'Individual';
      case 'team_member': return 'Team Member';
      case 'team_manager': return 'Team Manager';
      case 'administrator': return 'Administrator';
      default: return 'User';
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case 'individual': return 'Personal security workspace';
      case 'team_member': return 'Collaborate with your security team';
      case 'team_manager': return 'Manage your team and resources';
      case 'administrator': return 'Full platform administration';
      default: return 'User account';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your SecureCanvas Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-secure/10">
            {getRoleIcon()}
          </div>
          <div>
            <h3 className="font-medium">{getRoleTitle()}</h3>
            <p className="text-sm text-muted-foreground">{getRoleDescription()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/profile">
            Manage Your Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserRoleCard;
