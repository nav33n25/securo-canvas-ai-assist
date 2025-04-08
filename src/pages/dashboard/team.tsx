
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3, 
  PieChart,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PieChart as RechartssPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

// Mock team members data
const teamMembers = [
  {
    id: "user1",
    name: "Alex Johnson",
    role: "Security Engineer",
    avatarUrl: "",
    initials: "AJ",
    status: "online",
    tasks: { completed: 12, total: 15 },
    productivity: 85,
    lastActive: "Just now"
  },
  {
    id: "user2",
    name: "Maria Garcia",
    role: "Threat Analyst",
    avatarUrl: "",
    initials: "MG",
    status: "online",
    tasks: { completed: 8, total: 10 },
    productivity: 92,
    lastActive: "2 minutes ago"
  },
  {
    id: "user3",
    name: "David Kim",
    role: "Penetration Tester",
    avatarUrl: "",
    initials: "DK",
    status: "away",
    tasks: { completed: 5, total: 8 },
    productivity: 76,
    lastActive: "1 hour ago"
  },
  {
    id: "user4",
    name: "Sarah Wilson",
    role: "Security Architect",
    avatarUrl: "",
    initials: "SW",
    status: "offline",
    tasks: { completed: 9, total: 12 },
    productivity: 68,
    lastActive: "3 hours ago"
  },
  {
    id: "user5",
    name: "Michael Brown",
    role: "Compliance Specialist",
    avatarUrl: "",
    initials: "MB",
    status: "online",
    tasks: { completed: 7, total: 7 },
    productivity: 95,
    lastActive: "5 minutes ago"
  }
];

// Mock projects data
const projects = [
  {
    id: "proj1",
    name: "Security Posture Assessment",
    progress: 75,
    category: "Assessment",
    dueDate: "2023-12-15",
    assignees: ["user1", "user3", "user5"],
    status: "in-progress"
  },
  {
    id: "proj2",
    name: "SIEM Implementation",
    progress: 45,
    category: "Infrastructure",
    dueDate: "2024-01-10",
    assignees: ["user2", "user4"],
    status: "in-progress"
  },
  {
    id: "proj3",
    name: "Incident Response Plan Update",
    progress: 90,
    category: "Planning",
    dueDate: "2023-11-30",
    assignees: ["user1", "user5"],
    status: "review"
  },
  {
    id: "proj4",
    name: "Annual Penetration Test",
    progress: 20,
    category: "Assessment",
    dueDate: "2024-02-15",
    assignees: ["user3", "user2"],
    status: "in-progress"
  }
];

// Mock team metrics
const teamMetrics = {
  tasksCompleted: 122,
  tasksInProgress: 45,
  tasksOverdue: 8,
  averageCompletion: 86,
  documentsCreated: 34,
  vulnerabilitiesClosed: 67
};

// Mock productivity data for chart
const productivityData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 78 },
  { name: 'Wed', value: 89 },
  { name: 'Thu', value: 72 },
  { name: 'Fri', value: 85 },
  { name: 'Sat', value: 40 },
  { name: 'Sun', value: 30 },
];

// Task distribution data
const taskDistribution = [
  { name: 'Assessment', value: 35 },
  { name: 'Documentation', value: 25 },
  { name: 'Remediation', value: 20 },
  { name: 'Planning', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TeamDashboardPage: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-amber-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 45) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'review':
        return <Badge className="bg-blue-500">In Review</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8" />
              Team Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor team performance, activities, and security projects
            </p>
          </div>
          <Button>
            Add Team Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold">{teamMetrics.tasksCompleted}</p>
                <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full px-2 py-0.5 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  +14% 
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold">{teamMetrics.tasksInProgress}</p>
                <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full px-2 py-0.5 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Active
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold">{teamMetrics.tasksOverdue}</p>
                <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full px-2 py-0.5 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Attention
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold">{teamMetrics.averageCompletion}%</p>
                <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full px-2 py-0.5 flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  +5%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>Weekly team performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={productivityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Current team security projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{project.category}</Badge>
                          {getProjectStatusBadge(project.status)}
                          <span className="text-xs text-muted-foreground">Due {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {project.assignees.map(userId => {
                          const member = getMemberById(userId);
                          return member ? (
                            <Avatar key={userId} className="h-7 w-7 border-2 border-background">
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full">
                        <div className={`h-1.5 rounded-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Activity and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{member.name}</p>
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(member.status)}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <div className="mt-1 h-1 w-full bg-secondary rounded-full">
                        <div 
                          className="h-1 rounded-full bg-secure" 
                          style={{ width: `${member.productivity}%` }} 
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{member.tasks.completed}/{member.tasks.total}</p>
                      <p className="text-xs text-muted-foreground">{member.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Team Details</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default TeamDashboardPage;
