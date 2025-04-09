import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import TicketForm from "@/components/tickets/TicketForm";
import { Button } from "@/components/ui/button";

export default function CreateTicketPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1"
          >
            <Link href="/tickets">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <TicketForm />
        </div>
      </div>
    </AppLayout>
  );
}