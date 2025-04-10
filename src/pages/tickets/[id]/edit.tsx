import { useState, useEffect } from "react";
import { useRouter } from "@/lib/next-compatibility/router";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import TicketForm from "@/components/tickets/TicketForm";
import { Button } from "@/components/ui/button";
import { useTickets } from "@/hooks/useTickets";
import { useToast } from "@/hooks/use-toast";
import { SecurityTicket } from "@/types/common";

export default function EditTicketPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getTicketById } = useTickets();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<SecurityTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      if (!id || typeof id !== "string") return;

      setIsLoading(true);
      try {
        const ticketData = await getTicketById(id);
        setTicket(ticketData);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to fetch ticket details");
        toast({
          title: "Error",
          description: "Failed to fetch ticket details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTicket();
  }, [id, getTicketById, toast]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading ticket details...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !ticket) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/tickets">
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </Link>
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-2">Error</h1>
            <p className="text-center text-muted-foreground">
              {error || "Ticket not found"}
            </p>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link to="/tickets">View All Tickets</Link>
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={`/tickets/${ticket.id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Ticket
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <TicketForm existingTicket={ticket} isEditMode={true} />
        </div>
      </div>
    </AppLayout>
  );
}
