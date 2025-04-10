
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { useTickets } from '@/hooks/useTickets';

const TicketsAnalyticsPage = () => {
  const { tickets, loading } = useTickets();

  // Calculate statistics
  const ticketsByStatus = React.useMemo(() => {
    const counts = {
      open: 0,
      in_progress: 0,
      review: 0,
      resolved: 0,
      closed: 0
    };
    
    tickets.forEach(ticket => {
      // Convert status to lowercase and replace spaces with underscores for consistency
      const status = ticket.status.toLowerCase().replace(' ', '_');
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value
    }));
  }, [tickets]);
  
  const ticketsByPriority = React.useMemo(() => {
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    tickets.forEach(ticket => {
      const priority = ticket.priority.toLowerCase();
      if (counts[priority] !== undefined) {
        counts[priority]++;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/\b\w/g, l => l.toUpperCase()),
      value
    }));
  }, [tickets]);
  
  // Average resolution time
  const resolutionTimeData = React.useMemo(() => {
    const monthlyData = {};
    
    tickets.forEach(ticket => {
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        const createdDate = new Date(ticket.created_at);
        const updatedDate = new Date(ticket.updated_at);
        const diffTime = Math.abs(updatedDate - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { total: 0, count: 0 };
        }
        
        monthlyData[monthYear].total += diffDays;
        monthlyData[monthYear].count += 1;
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      average: data.count > 0 ? Math.round(data.total / data.count) : 0
    }));
  }, [tickets]);
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Ticket Analytics</h1>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets by Status</CardTitle>
                  <CardDescription>Distribution of tickets across different statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  ) : ticketsByStatus.some(item => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ticketsByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ticketsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-muted-foreground">No ticket data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tickets by Priority</CardTitle>
                  <CardDescription>Distribution of tickets by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  ) : ticketsByPriority.some(item => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ticketsByPriority}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ticketsByPriority.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-muted-foreground">No ticket data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Ticket Summary</CardTitle>
                <CardDescription>Key metrics from your ticket system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Total Tickets</p>
                    <p className="text-3xl font-bold">{tickets.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Open Tickets</p>
                    <p className="text-3xl font-bold">
                      {tickets.filter(t => t.status === 'open').length}
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Resolved Tickets</p>
                    <p className="text-3xl font-bold">
                      {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">Critical Issues</p>
                    <p className="text-3xl font-bold text-red-500">
                      {tickets.filter(t => t.priority === 'critical').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Time</CardTitle>
                <CardDescription>Average days to resolution by month</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : resolutionTimeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={resolutionTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" name="Avg. Days to Resolution" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">No resolution data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Creation Trend</CardTitle>
                <CardDescription>Number of tickets created over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">Trend data will be generated as more tickets are processed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TicketsAnalyticsPage;
