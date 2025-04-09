import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole, SubscriptionPlan } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [authStep, setAuthStep] = useState<'signIn' | 'signUp' | 'success'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in');
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    
    // Add mapping from UI plan names to subscription plan names
    let subscriptionPlan: SubscriptionPlan = 'free';
    if (selectedPlan === 'Pro') {
      subscriptionPlan = 'pro';
    } else if (selectedPlan === 'Team') {
      subscriptionPlan = 'team';
    } else if (selectedPlan === 'Enterprise') {
      subscriptionPlan = 'enterprise';
    }

    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        role: getDefaultRoleForPlan(selectedPlan),
        subscriptionPlan, // Use subscription plan property
      });
      
      setAuthStep('success');
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultRoleForPlan = (plan: string): UserRole => {
    switch (plan) {
      case 'Free':
        return planRoles.free[0];
      case 'Pro':
        return planRoles.pro[0];
      case 'Team':
        return planRoles.team[0];
      case 'Enterprise':
        return planRoles.enterprise[0];
      default:
        return 'individual_basic';
    }
  };

  const planRoles: Record<SubscriptionPlan, UserRole[]> = {
    'free': ['individual_basic'],
    'pro': ['individual_professional'],
    'team': ['team_member'],
    'enterprise': ['administrator'],
  };

  if (authStep === 'success') {
    return (
      <div className="grid h-screen place-items-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Sign Up Successful</CardTitle>
            <CardDescription>
              Your account has been created. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>{authStep === 'signIn' ? 'Sign In' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {authStep === 'signIn'
              ? 'Enter your email and password to sign in'
              : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {authStep === 'signUp' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Select Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="john.doe@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {authStep === 'signIn' ? (
            <>
              <Button onClick={handleSignIn} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <Button variant="secondary" onClick={() => setAuthStep('signUp')}>
                Create Account
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSignUp} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
              <Button variant="secondary" onClick={() => setAuthStep('signIn')}>
                Already have an account?
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
