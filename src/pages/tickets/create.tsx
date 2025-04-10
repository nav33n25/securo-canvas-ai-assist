
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import TicketForm from "@/components/tickets/TicketForm";
import { Button } from "@/components/ui/button";

export default function CreateTicketPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate("/tickets")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <TicketForm />
        </div>
      </div>
    </AppLayout>
  );
}
