import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole, SubscriptionPlan, planRoles } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Check, CreditCard } from 'lucide-react';
import RoleSelection from '@/components/auth/RoleSelection';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Loader2, CheckIcon } from 'lucide-react';

export interface PlanInfo {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: string;
  allowedRoles: UserRole[];
  recommended?: boolean;
  tag?: string;
  features: string[];
}

const plans: PlanInfo[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features for personal use',
    price: 'Free',
    allowedRoles: planRoles.free,
    tag: 'Basic',
    features: [
      'Basic document encryption',
      'Up to 3 secure documents',
      'Personal workspace',
      'Email support'
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced features for professionals',
    price: '$19/month',
    allowedRoles: planRoles.pro,
    recommended: true,
    tag: 'Popular',
    features: [
      'Advanced encryption options',
      'Unlimited secure documents',
      'Collaboration tools',
      'Priority support',
      'Audit trails'
    ],
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Essential tools for small teams',
    price: '$49/month',
    allowedRoles: planRoles.team,
    tag: 'Team',
    features: [
      'Everything in Pro',
      'Team management',
      'Role-based access control',
      'Dedicated support',
      'Analytics dashboard'
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Enhanced security for organizations',
    price: '$99/month',
    allowedRoles: planRoles.enterprise,
    tag: 'Enterprise',
    features: [
      'Everything in Team',
      'Custom security policies',
      'Advanced admin controls',
      'API access',
      'Dedicated account manager',
      'On-premises deployment option'
    ],
  }
];

const Auth = () => {
  const { signIn, signUp, isAuthenticated, redirectTo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'signin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [step, setStep] = useState(1);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    if (!email || !password || !firstName || !lastName || !role || !plan) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        role,
        plan,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setStep(1);
    setIsSignUp(tab === "signUp");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo || "/dashboard");
    }
  }, [isAuthenticated, redirectTo, navigate]);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#111827]">
      <div className="relative hidden h-full flex-1 items-center justify-center bg-[#141e33] lg:flex">
        <div className="max-w-md px-6 text-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="mx-auto h-12 w-12"
          />
          <h1 className="mt-6 text-3xl font-bold text-white">SecuroCanvas</h1>
          <p className="mt-2 text-lg text-gray-300">
            Secure document management for teams and individuals
          </p>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-6">
            <div>
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-12 w-12 lg:hidden"
              />
              <h2 className="mt-6 text-2xl font-bold text-white">
                {isSignUp ? 'Create an account' : 'Sign in to your account'}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {isSignUp 
                  ? 'Already have an account? ' 
                  : 'Don\'t have an account? '}
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => handleTabChange(isSignUp ? 'signIn' : 'signUp')}
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-[#1d283a]">
                <TabsTrigger value="signIn" className="text-gray-200">Sign In</TabsTrigger>
                <TabsTrigger value="signUp" className="text-gray-200">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signIn">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-gray-200">Email</Label>
                    <Input
                      id="email"
                      placeholder="your@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#1d283a] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-200">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-gray-400 hover:text-blue-400"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#1d283a] border-gray-700 text-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="full" 
                    className="mt-4" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signUp">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="signUpEmail">Email</Label>
                        <Input
                          id="signUpEmail"
                          placeholder="your@email.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="signUpPassword">Password</Label>
                        <Input
                          id="signUpPassword"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!email || !password || !firstName || !lastName || password !== confirmPassword}
                      >
                        Continue
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Choose a Plan</h3>
                            <p className="text-sm text-muted-foreground">Select the plan that works best for you</p>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded">DEV MODE - All Plans Free</span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                          {plans.map((p) => (
                            <PlanCard
                              key={p.id}
                              plan={p}
                              selected={p.id === plan}
                              onSelect={() => setPlan(p.id as SubscriptionPlan)}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button onClick={() => setStep(3)}>
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold">Select Your Role</h3>
                        <p className="text-sm text-muted-foreground">Choose the role that best describes you</p>
                      </div>

                      <RoleSelection
                        initialRole={role}
                        allowedRoles={plans.find(p => p.id === plan)?.allowedRoles || []}
                        onRoleSelect={setRole}
                        showContinueButton={false}
                      />

                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button type="submit" disabled={loading || !role}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Sign Up"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, selected, onSelect }: { 
  plan: PlanInfo; 
  selected: boolean; 
  onSelect: () => void 
}) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-md cursor-pointer ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      {plan.recommended && (
        <Badge className="absolute right-2 top-2 z-10" variant="secondary">
          Recommended
        </Badge>
      )}
      {plan.tag && (
        <Badge className="absolute left-2 top-2" variant="outline">
          {plan.tag}
        </Badge>
      )}
      <CardHeader className="pb-2">
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">{plan.price}</span>
          {plan.id !== 'free' && (
            <Badge variant="outline" className="text-green-600 bg-green-50">
              Free in dev
            </Badge>
          )}
        </div>
        
        <ul className="mt-4 space-y-2 text-sm">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckIcon className="mr-2 h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-0">
        {selected ? (
          <Badge className="w-full justify-center py-1.5" variant="default">
            Selected
          </Badge>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onSelect}
          >
            Select Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Auth;
