import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  BarChart,
  CreditCard,
  FileText,
  HelpCircle,
  LineChart,
  Lock,
  Settings,
  ShieldAlert,
  User,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const WelcomeMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
        <CardDescription>
          {children}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Jump straight into common tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Button variant="secondary" className="justify-start">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
        <Button variant="secondary" className="justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Create New Document
        </Button>
        <Button variant="secondary" className="justify-start">
          <ShieldAlert className="mr-2 h-4 w-4" />
          Report Security Issue
        </Button>
        <Button variant="secondary" className="justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Browse Knowledge Base
        </Button>
        <Button variant="secondary" className="justify-start">
          <BarChart className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
        <Button variant="secondary" className="justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Adjust Settings
        </Button>
      </CardContent>
    </Card>
  );
};

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Stay up to date on what's been happening
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium leading-none">
              New user registered
            </p>
          </div>
          <Badge variant="secondary">1 hour ago</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium leading-none">
              Document edited
            </p>
          </div>
          <Badge variant="secondary">2 hours ago</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium leading-none">
              Security alert triggered
            </p>
          </div>
          <Badge variant="secondary">3 hours ago</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const BillingOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Overview</CardTitle>
        <CardDescription>
          Review your current billing status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Current Plan: <Badge variant="outline">Professional</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              Next payment due on January 1, 2024
            </p>
          </div>
          <div className="text-2xl font-bold">$49.00</div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            View full billing history
          </p>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <WelcomeMessage>
          Welcome back, {user?.firstName || 'Security Professional'}
        </WelcomeMessage>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Across all teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">124</div>
              <p className="text-sm text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Tickets</CardTitle>
              <CardDescription>Currently open issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">32</div>
              <p className="text-sm text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>Overall security posture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">88</div>
              <p className="text-sm text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Professional</div>
              <p className="text-sm text-muted-foreground">
                Expires December 31, 2023
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActions />
          <RecentActivity />
          <BillingOverview />

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Profile Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user?.firstName} className="bg-muted" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={user?.email} className="bg-muted" disabled />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Notifications</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch id="push-notifications" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Appearance</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch id="dark-mode" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
