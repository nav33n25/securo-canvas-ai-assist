import { useState, useEffect } from "react";
import { useRouter } from "@/lib/next-compatibility/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTickets } from "@/hooks/useTickets";
import { SecurityTicket, TicketCreateData, TicketStatus, TicketPriority } from "@/types/common";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  priority: z.enum(["low", "medium", "high", "critical"] as const),
  status: z.enum(["open", "in_progress", "review", "resolved", "closed"] as const),
  ticket_type: z.string().default("general")
});

type FormValues = z.infer<typeof formSchema>;

interface TicketFormProps {
  existingTicket?: SecurityTicket; // Optional for edit mode
  isEditMode?: boolean;
}

export default function TicketForm({ existingTicket, isEditMode = false }: TicketFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { createTicket, updateTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingTicket?.title || "",
      description: existingTicket?.description || "",
      priority: (existingTicket?.priority || "medium") as TicketPriority,
      status: (existingTicket?.status || "open") as TicketStatus,
      ticket_type: existingTicket?.ticket_type || "general"
    },
  });

  // Update form when existingTicket changes
  useEffect(() => {
    if (existingTicket) {
      form.reset({
        title: existingTicket.title,
        description: existingTicket.description || "",
        priority: existingTicket.priority as TicketPriority,
        status: existingTicket.status as TicketStatus,
        ticket_type: existingTicket.ticket_type || "general"
      });
    }
  }, [existingTicket, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditMode && existingTicket) {
        // Update existing ticket
        await updateTicket(existingTicket.id, values);
        toast({
          title: "Success",
          description: "Ticket updated successfully",
        });
      } else {
        // Create new ticket
        await createTicket(values as TicketCreateData);
        toast({
          title: "Success",
          description: "Ticket created successfully",
        });
      }
      
      // Redirect to tickets page
      router.push("/tickets");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} ticket.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Ticket" : "Create New Ticket"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the details of an existing ticket"
            : "Fill in the details to create a new ticket"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ticket title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue or task"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ticket_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="security">Security Issue</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/tickets")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Ticket" : "Create Ticket"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
