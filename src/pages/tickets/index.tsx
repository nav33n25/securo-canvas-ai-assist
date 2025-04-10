
import { useState } from "react";
import { useRouter } from "@/lib/next-compatibility/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import TicketList from "@/components/tickets/TicketList";
import { useTickets } from "@/hooks/useTickets";
import { useAuth } from "@/hooks/useAuth";
import { SecurityTicket } from "@/types/common";

export default function TicketsPage() {
  const router = useRouter();
  const { tickets, isLoading, error, filterTickets } = useTickets();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("all");

  const navigateToCreateTicket = () => {
    router.push("/tickets/create");
  };

  const navigateToAnalytics = () => {
    router.push("/tickets/analytics");
  };

  const getFilteredTickets = (): SecurityTicket[] => {
    return filterTickets(activeView as 'all' | 'assigned' | 'created');
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground">
              Manage and track security issues and vulnerabilities
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={navigateToAnalytics}>
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </Button>
            <Button onClick={navigateToCreateTicket}>
              <Plus className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="all" 
          value={activeView}
          onValueChange={setActiveView}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
            <TabsTrigger value="created">Created by Me</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TicketList 
              tickets={getFilteredTickets()} 
              isLoading={isLoading} 
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="assigned">
            <TicketList 
              tickets={getFilteredTickets()} 
              isLoading={isLoading} 
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="created">
            <TicketList 
              tickets={getFilteredTickets()} 
              isLoading={isLoading} 
              error={error}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
