
import React from 'react';
import { Link } from 'react-router-dom';
import { useRouter } from '@/lib/next-compatibility/router';

const TicketDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Ticket Details for Ticket {id}</h1>
      <Link to="/security/tickets">Back to Tickets</Link>
    </div>
  );
};

export default TicketDetails;
