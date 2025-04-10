
import React from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { SecurityTicket, TicketPriority, TicketStatus } from '@/types/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
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
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Timer, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

// Colors for charts
const COLORS = {
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  purple: '#a855f7',
  gray: '#6b7280',
  orange: '#f97316',
  pink: '#ec4899',
  lime: '#84cc16',
  indigo: '#6366f1',
};

// Status colors
const STATUS_COLORS = {
  open: COLORS.blue,
  in_progress: COLORS.orange,
  review: COLORS.purple,
  resolved: COLORS.green,
  closed: COLORS.gray,
};

// Priority colors
const PRIORITY_COLORS = {
  low: COLORS.blue,
  medium: COLORS.yellow,
  high: COLORS.orange,
  critical: COLORS.red,
};

// Helper to calculate metrics
const calculateMetrics = (tickets: SecurityTicket[]) => {
  // Status counts
  const statusCounts = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    review: tickets.filter(t => t.status === 'review').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  // Priority counts
  const priorityCounts = {
    low: tickets.filter(t => t.priority === 'low').length,
    medium: tickets.filter(t => t.priority === 'medium').length,
    high: tickets.filter(t => t.priority === 'high').length,
    critical: tickets.filter(t => t.priority === 'critical').length,
  };

  // Type counts
  const typeCounts: Record<string, number> = {};
  tickets.forEach(ticket => {
    const type = ticket.ticket_type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Calculate response time (dummy data for now)
  // In a real app, you would calculate this from ticket timestamps
  const responseTime = {
    average: 24, // hours
    change: -5, // improvement of 5 hours
  };

  // Calculate resolution time (dummy data for now)
  const resolutionTime = {
    average: 72, // hours
    change: 2, // worsened by 2 hours
  };

  // Calculate monthly ticket trends (dummy data)
  const monthlyData = [
    { name: 'Jan', open: 12, resolved: 10 },
    { name: 'Feb', open: 19, resolved: 15 },
    { name: 'Mar', open: 15, resolved: 17 },
    { name: 'Apr', open: 21, resolved: 19 },
    { name: 'May', open: 18, resolved: 20 },
    { name: 'Jun', open: 24, resolved: 22 },
  ];

  return {
    statusCounts,
    priorityCounts,
    typeCounts,
    responseTime,
    resolutionTime,
    monthlyData,
    totalTickets: tickets.length,
    openTickets: statusCounts.open + statusCounts.in_progress + statusCounts.review,
    closedTickets: statusCounts.resolved + statusCounts.closed,
  };
};

const TicketAnalytics: React.FC = () => {
  const { tickets } = useTickets();
  const { user } = useAuth();
  
  const metrics = calculateMetrics(tickets);

  // Prepare data for charts
  const statusData = Object.entries(metrics.statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const priorityData = Object.entries(metrics.priorityCounts).map(([priority, count]) => ({
    name: priority,
    value: count,
  }));

  const typeData = Object.entries(metrics.typeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTickets}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <LineChart width={90} height={30} data={metrics.monthlyData}>
                <Line 
                  type="monotone" 
                  dataKey="open" 
                  stroke={COLORS.blue} 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
              <span className="ml-2">Trending over time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime.average}h</div>
            <div className="flex items-center text-sm mt-1">
              {metrics.responseTime.change < 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>{Math.abs(metrics.responseTime.change)}h faster</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{metrics.responseTime.change}h slower</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resolutionTime.average}h</div>
            <div className="flex items-center text-sm mt-1">
              {metrics.resolutionTime.change < 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>{Math.abs(metrics.resolutionTime.change)}h faster</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{metrics.resolutionTime.change}h slower</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
            <CardDescription>
              Distribution of tickets across different statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS.gray} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>
              Distribution of tickets across different priority levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Tickets"
                    radius={[4, 4, 0, 0]}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || COLORS.gray} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Ticket Trends</CardTitle>
          <CardDescription>
            Comparison of opened vs resolved tickets over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="open" 
                  stroke={COLORS.blue} 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Opened"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke={COLORS.green} 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketAnalytics;
