import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { CombinedUserRole, SubscriptionTier, subscriptionTierRoleMap } from '@/types/auth-types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const auth = useAuth();
  const { toast } = useToast();

  // Placeholder subscription data - would typically come from your subscription service
  const subscriptionTiers: { id: SubscriptionTier; name: string; description: string; roles: CombinedUserRole[] }[] = [
    {
      id: 'individual',
      name: 'Individual',
      description: 'For personal use and solo professionals',
      roles: subscriptionTierRoleMap['individual']
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced features for power users',
      roles: subscriptionTierRoleMap['professional']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Collaborative tools for teams',
      roles: subscriptionTierRoleMap['enterprise']
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !firstName || !lastName) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await auth.register({
        email,
        password,
        firstName,
        lastName,
        subscriptionTier: 'individual'
      });
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. You may now log in.',
      });
      
      setActiveTab('login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (auth.isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to the Security Operations Hub</CardTitle>
          <CardDescription className="text-center">
            Manage security operations, documents, and tasks in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!email || !password) {
                  toast({
                    title: 'Error',
                    description: 'Please enter both email and password.',
                    variant: 'destructive',
                  });
                  return;
                }
                
                setIsLoading(true);
                
                auth.login(email, password)
                  .then(() => navigate('/dashboard'))
                  .catch((error) => {
                    console.error('Login error:', error);
                    toast({
                      title: 'Login failed',
                      description: error.message || 'An error occurred during login.',
                      variant: 'destructive',
                    });
                  })
                  .finally(() => setIsLoading(false));
              }} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <button type="button" className="text-xs text-blue-500 hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (!email || !password || !firstName || !lastName) {
                  toast({
                    title: 'Error',
                    description: 'Please fill in all fields.',
                    variant: 'destructive',
                  });
                  return;
                }
                
                setIsLoading(true);
                
                auth.register({
                  email,
                  password,
                  firstName,
                  lastName,
                  subscriptionTier: 'individual'
                })
                  .then(() => {
                    toast({
                      title: 'Registration successful',
                      description: 'Your account has been created. You may now log in.',
                    });
                    setActiveTab('login');
                  })
                  .catch((error) => {
                    console.error('Signup error:', error);
                    toast({
                      title: 'Registration failed',
                      description: error.message || 'An error occurred during registration.',
                      variant: 'destructive',
                    });
                  })
                  .finally(() => setIsLoading(false));
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="signupEmail" className="text-sm font-medium">Email</label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signupPassword" className="text-sm font-medium">Password</label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
