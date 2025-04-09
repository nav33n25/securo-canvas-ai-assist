
import React from 'react';
import { UserRole } from '@/contexts/AuthContext';

interface WelcomeSectionProps {
  firstName?: string | null;
  role: UserRole | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ firstName, role }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getDisplayName = () => {
    if (firstName) {
      return firstName;
    }
    return 'there';
  };
  
  const getWelcomeMessage = () => {
    switch(role) {
      case 'individual':
        return 'Welcome to your personal security workspace';
      case 'team_member':
        return 'Access tools to support your security team';
      case 'team_manager':
        return 'Manage your security team and resources';
      case 'administrator':
        return 'Administer the SecureCanvas platform';
      default:
        return 'Welcome to SecureCanvas';
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-1">
        {getGreeting()}, {getDisplayName()}
      </h1>
      <p className="text-muted-foreground">
        {getWelcomeMessage()}
      </p>
    </div>
  );
};

export default WelcomeSection;
