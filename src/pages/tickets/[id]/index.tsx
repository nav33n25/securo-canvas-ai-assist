import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar 
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

// Status and priority color mappings
const statusColors = {
  new: "bg-blue-500",
  in_progress: "bg-yellow-500",
  in_review: "bg-purple-500",
  closed: "bg-green-500"
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500"
};

const statusLabels = {
  new: "New",
  in_progress: "In Progress",
  in_review: "In Review",
  closed: "Closed"
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent"
};

export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getTicketById, deleteTicket } = useTickets();
  const { toast } = useToast();
  const { user } = useUser();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {
    if (!ticket) return;
    
    setIsDeleting(true);
    try {
      await deleteTicket(ticket.id);
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });
      router.push("/tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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
              <Link href="/tickets">
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
                <Link href="/tickets">View All Tickets</Link>
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
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/tickets">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/tickets/${ticket.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete this ticket and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Ticket"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{ticket.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={`${statusColors[ticket.status]} hover:${statusColors[ticket.status]}`}>
                        {statusLabels[ticket.status]}
                      </Badge>
                      <Badge className={`${priorityColors[ticket.priority]} hover:${priorityColors[ticket.priority]}`}>
                        {priorityLabels[ticket.priority]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none mt-4">
                  <p>{ticket.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments section can be added here */}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(ticket.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(ticket.updated_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created By</p>
                    <p className="text-sm text-muted-foreground">
                      {/* We would typically display the user's name here */}
                      User ID: {ticket.created_by}
                    </p>
                  </div>
                </div>

                {ticket.assigned_to && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Assigned To</p>
                      <p className="text-sm text-muted-foreground">
                        {/* We would typically display the assignee's name here */}
                        User ID: {ticket.assigned_to}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 