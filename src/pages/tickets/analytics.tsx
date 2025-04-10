
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TicketAnalytics from '@/components/tickets/TicketAnalytics';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BarChart3,
  Download
} from 'lucide-react';

const TicketsAnalyticsPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </div>
          
          <div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Ticket Analytics
          </h1>
          <p className="text-muted-foreground">
            Performance metrics and insights for your security operations
          </p>
        </div>
        
        <TicketAnalytics />
      </div>
    </AppLayout>
  );
};

export default TicketsAnalyticsPage;
