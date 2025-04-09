import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole, SubscriptionPlan, planRoles } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Check, CreditCard } from 'lucide-react';
import RoleSelection from '@/components/auth/RoleSelection';
import { toast } from '@/components/ui/use-toast';

// Define subscription plans and their allowed roles
export interface PlanInfo {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: string;
  allowedRoles: UserRole[];
  recommended?: boolean;
}

const subscriptionPlans: PlanInfo[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For students and security enthusiasts',
    price: 'Free',
    allowedRoles: planRoles.free,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For security professionals and consultants',
    price: '$19/month',
    allowedRoles: planRoles.pro,
    recommended: true,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For security teams and departments',
    price: '$49/month',
    allowedRoles: planRoles.team,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full platform access for organizations',
    price: '$99/month',
    allowedRoles: planRoles.enterprise,
  }
];

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
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual');
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
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
    
    if (!showPlanSelection && !showRoleSelection) {
      // First step: Show plan selection
      setShowPlanSelection(true);
      setIsSubmitting(false);
    } else if (showPlanSelection && !showRoleSelection) {
      // Second step: Show role selection
      setShowPlanSelection(false);
      setShowRoleSelection(true);
      setIsSubmitting(false);
    } else {
      if (!selectedPlan) {
        toast({
          variant: "destructive",
          title: "No plan selected",
          description: "Please select a subscription plan.",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Final step: Complete sign up with selected role and plan
      await signUp(email, password, firstName, lastName, selectedRole, selectedPlan.id);
      setIsSubmitting(false);
      // Reset selection views
      setShowRoleSelection(false);
      setShowPlanSelection(false);
    }
  };
  
  const handlePlanSelected = (plan: PlanInfo) => {
    setSelectedPlan(plan);
    
    // Default to the highest role allowed by the plan
    const highestRole = plan.allowedRoles[plan.allowedRoles.length - 1];
    setSelectedRole(highestRole);
  };
  
  const handleRoleSelected = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowRoleSelection(false);
    setShowPlanSelection(false);
  };

  const handleBackFromRoleSelection = () => {
    setShowRoleSelection(false);
    setShowPlanSelection(true);
  };
  
  const handleBackFromPlanSelection = () => {
    setShowPlanSelection(false);
  };

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the plan selection step
  const renderPlanSelection = () => (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPlan?.id === plan.id ? 'ring-2 ring-secure bg-secure/5' : ''
            } ${plan.recommended ? 'border-secure' : ''}`}
            onClick={() => handlePlanSelected(plan)}
          >
            <CardContent className="p-4">
              {plan.recommended && (
                <div className="bg-secure text-white text-xs px-2 py-0.5 rounded absolute -mt-6 right-2">
                  Recommended
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                </div>
                {selectedPlan?.id === plan.id && (
                  <Check className="h-5 w-5 text-secure" />
                )}
              </div>
              <div className="text-xl font-bold">{plan.price}</div>
              <div className="mt-3 text-xs text-muted-foreground">
                Available roles: {plan.allowedRoles.map(role => 
                  role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                ).join(', ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBackFromPlanSelection}
        >
          Back
        </Button>
        <Button 
          onClick={handleSignUp}
          className="bg-secure hover:bg-secure-darker"
          disabled={!selectedPlan || isSubmitting}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </div>
  );

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
              {showRoleSelection 
                ? "Select Your Role" 
                : showPlanSelection 
                ? "Choose Your Plan" 
                : "Authentication"}
            </CardTitle>
            <CardDescription>
              {showRoleSelection 
                ? "Choose the role that best describes your security work" 
                : showPlanSelection
                ? "Select a plan that matches your security needs"
                : "Sign in to your account or create a new one"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {showRoleSelection ? (
              <div className="px-6 py-4">
                <RoleSelection 
                  initialRole={selectedRole}
                  onRoleSelect={handleRoleSelected}
                  showContinueButton={false}
                  allowedRoles={selectedPlan?.allowedRoles || []}
                />
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handleBackFromRoleSelection}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSignUp}
                    className="bg-secure hover:bg-secure-darker"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Complete Registration'}
                  </Button>
                </div>
              </div>
            ) : showPlanSelection ? (
              renderPlanSelection()
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
                      {isSubmitting ? 'Processing...' : 'Continue to Plan Selection'}
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

export default Auth;
