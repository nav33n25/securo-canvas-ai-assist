import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import RoleSelection from '@/components/auth/RoleSelection';
import { UserRole } from '@/contexts/AuthContext';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'signin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual');
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!showRoleSelection) {
      // First step: Show role selection
      setShowRoleSelection(true);
      setIsSubmitting(false);
    } else {
      // Second step: Complete sign up with selected role
      await signUp(email, password, firstName, lastName, selectedRole);
      setIsSubmitting(false);
      // Reset role selection view
      setShowRoleSelection(false);
    }
  };
  
  const handleRoleSelected = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowRoleSelection(false);
  };

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <Shield className="h-12 w-12 text-secure mb-2" />
          <h1 className="text-2xl font-bold">SecureCanvas</h1>
          <p className="text-muted-foreground">Security documentation platform</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {showRoleSelection ? "Select Your Role" : "Authentication"}
            </CardTitle>
            <CardDescription>
              {showRoleSelection 
                ? "Choose the role that best describes your security work" 
                : "Sign in to your account or create a new one"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {showRoleSelection ? (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RoleCard 
                    title="Individual"
                    description="Students, bug bounty hunters, consultants"
                    role="individual"
                    isSelected={selectedRole === 'individual'}
                    onSelect={handleRoleSelected}
                  />
                  <RoleCard 
                    title="Team Member"
                    description="Security professionals in organizations"
                    role="team_member"
                    isSelected={selectedRole === 'team_member'}
                    onSelect={handleRoleSelected}
                  />
                  <RoleCard 
                    title="Team Manager"
                    description="Security team leaders, CISOs"
                    role="team_manager"
                    isSelected={selectedRole === 'team_manager'}
                    onSelect={handleRoleSelected}
                  />
                  <RoleCard 
                    title="Administrator"
                    description="Platform administrators"
                    role="administrator"
                    isSelected={selectedRole === 'administrator'}
                    onSelect={handleRoleSelected}
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowRoleSelection(false)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSignUp}
                    className="bg-secure hover:bg-secure-darker"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Continue'}
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs 
                value={activeTab} 
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="px-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-secure hover:bg-secure-darker"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="px-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailSignup">Email</Label>
                      <Input 
                        id="emailSignup" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordSignup">Password</Label>
                      <Input 
                        id="passwordSignup" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-secure hover:bg-secure-darker"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Continue to Role Selection'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Simple role card component for the auth page
interface RoleCardProps {
  title: string;
  description: string;
  role: UserRole;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, role, isSelected, onSelect }) => (
  <div 
    className={`border rounded-md p-3 cursor-pointer transition-all hover:bg-accent/50 ${
      isSelected ? 'border-secure bg-secure/5' : 'border-border'
    }`}
    onClick={() => onSelect(role)}
  >
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Auth;
