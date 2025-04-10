
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TicketDetails from '@/components/security/TicketDetails';

const TicketPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <TicketDetails />
      </div>
    </AppLayout>
  );
};

export default TicketPage;
