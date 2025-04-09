import { useState } from "react";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import TicketList from "@/components/tickets/TicketList";
import { Ticket, useTickets } from "@/hooks/useTickets";

export default function TicketsPage() {
  const router = useRouter();
  const { tickets, isLoading, error } = useTickets();
  const [activeView, setActiveView] = useState("all");

  const navigateToCreateTicket = () => {
    router.push("/tickets/create");
  };

  // Filter tickets based on the active view
  const getFilteredTickets = (): Ticket[] => {
    switch (activeView) {
      case "assigned":
        // This would filter tickets assigned to the current user
        // For now, just return all tickets
        return tickets;
      case "created":
        // This would filter tickets created by the current user
        // For now, just return all tickets
        return tickets;
      case "all":
      default:
        return tickets;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground">
              Manage and track support tickets and issues
            </p>
          </div>
          <Button onClick={navigateToCreateTicket}>
            <Plus className="mr-2 h-4 w-4" /> Create Ticket
          </Button>
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