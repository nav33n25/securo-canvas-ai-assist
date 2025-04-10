
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTicketAnalytics, TicketAnalytics } from '@/services/securityDataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, BarChart2, Clock, Clock4, List, Circle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

// Colors for charts
const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];
const PRIORITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6'
};

const STATUS_NAMES = {
  open: 'Open',
  in_progress: 'In Progress',
  review: 'In Review',
  resolved: 'Resolved',
  closed: 'Closed'
};

const TicketAnalyticsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ticketAnalytics'],
    queryFn: getTicketAnalytics
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            Error loading ticket analytics data. Please try again later.
          </div>
        </div>
      </AppLayout>
    );
  }

  // Format data for status pie chart
  const statusData = [
    { name: 'Open', value: data.byStatus.open },
    { name: 'In Progress', value: data.byStatus.in_progress },
    { name: 'In Review', value: data.byStatus.review },
    { name: 'Resolved', value: data.byStatus.resolved },
    { name: 'Closed', value: data.byStatus.closed }
  ];
  
  // Format data for priority pie chart
  const priorityData = [
    { name: 'Critical', value: data.byPriority.critical, color: PRIORITY_COLORS.critical },
    { name: 'High', value: data.byPriority.high, color: PRIORITY_COLORS.high },
    { name: 'Medium', value: data.byPriority.medium, color: PRIORITY_COLORS.medium },
    { name: 'Low', value: data.byPriority.low, color: PRIORITY_COLORS.low }
  ];

  // Calculate percentages
  const resolvedPercentage = Number(((data.resolution.resolvedCount / data.byStatus.total) * 100).toFixed(1));
  const openPercentage = Number(((data.byStatus.open / data.byStatus.total) * 100).toFixed(1));
  
  return (
    <AppLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart2 className="h-8 w-8 text-primary" />
            Ticket Analytics
          </h1>
          <p className="text-muted-foreground">
            Overview and insights from security ticket data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tickets</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.byStatus.total}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {data.byStatus.open} open / {data.resolution.resolvedCount} resolved
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resolution Rate</CardTitle>
              <CardDescription>Tickets closed vs total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{resolvedPercentage}%</div>
              <Progress className="h-2 mt-2" value={resolvedPercentage} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avg. Resolution Time</CardTitle>
              <CardDescription>Across resolved tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.resolution.averageTimeToResolve.toFixed(1)} hrs
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4 mr-1" />
                Based on {data.resolution.resolvedCount} tickets
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Open Rate</CardTitle>
              <CardDescription>Currently open vs total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{openPercentage}%</div>
              <Progress className="h-2 mt-2" value={openPercentage} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <Tabs defaultValue="status">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Ticket Distribution</CardTitle>
                  <TabsList>
                    <TabsTrigger value="status">By Status</TabsTrigger>
                    <TabsTrigger value="priority">By Priority</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="status" className="h-[300px] mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="priority" className="h-[300px] mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ticket Status</CardTitle>
              <CardDescription>Current ticket distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.byStatus).filter(([key]) => key !== 'total').map(([status, count]) => {
                  const percentage = (count as number) / data.byStatus.total * 100;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{STATUS_NAMES[status as keyof typeof STATUS_NAMES]}</span>
                        <span className="text-sm text-muted-foreground">{count} tickets ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tickets Created Over Time</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.trend.dates.map((date, i) => ({
                  date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  count: data.trend.counts[i]
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TicketAnalyticsPage;
