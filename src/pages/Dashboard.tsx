import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HelpCircle,
  ListChecks,
  ShieldAlert,
  User,
  Users,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const data = [
    { name: 'Open', value: 400 },
    { name: 'In Progress', value: 300 },
    { name: 'Resolved', value: 300 },
    { name: 'Closed', value: 200 },
  ];

  const barChartData = [
    { name: 'Week 1', tickets: 20 },
    { name: 'Week 2', tickets: 35 },
    { name: 'Week 3', tickets: 28 },
    { name: 'Week 4', tickets: 42 },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px] mt-2" />
            </div>
            <Skeleton className="h-10 w-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px]" />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              Hello, {user?.firstName || 'User'}
            </p>
            <p className="text-sm text-muted-foreground">
              Welcome back to your dashboard
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Security Tickets
              </CardTitle>
              <CardDescription>Track and manage security issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">42</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4 mr-2" />
                12 open / 30 resolved
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Vulnerability Scans
              </CardTitle>
              <CardDescription>Identify and remediate vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">15</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Next scan in 7 days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Security Awareness
              </CardTitle>
              <CardDescription>Educate users on security best practices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">8</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                Training sessions this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Compliance Checks
              </CardTitle>
              <CardDescription>Ensure adherence to security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">95%</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                All systems compliant
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Ticket Status Overview</CardTitle>
              <CardDescription>Distribution of tickets by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Ticket Activity</CardTitle>
              <CardDescription>Tickets created over the last 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tickets" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to frequently used tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/tickets/create">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </Link>
              <Link to="/tickets">
                <Button className="w-full">
                  <ListChecks className="h-4 w-4 mr-2" />
                  View All Tickets
                </Button>
              </Link>
              <Link to="/knowledge-base">
                <Button className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Access Knowledge Base
                </Button>
              </Link>
              <Link to="/tickets/analytics">
                <Button className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Ticket Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Need assistance? Find quick answers here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">FAQ</p>
                  <p className="text-sm text-muted-foreground">
                    Common questions and answers
                  </p>
                </div>
                <Button variant="ghost">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Documentation</p>
                  <p className="text-sm text-muted-foreground">
                    Detailed guides and tutorials
                  </p>
                </div>
                <Button variant="ghost">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact Support</p>
                  <p className="text-sm text-muted-foreground">
                    Get in touch with our support team
                  </p>
                </div>
                <Button variant="ghost">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
