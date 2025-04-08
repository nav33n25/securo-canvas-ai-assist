
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SecurityOverview from '@/components/dashboard/SecurityOverview';

const Index: React.FC = () => {
  return (
    <AppLayout>
      <SecurityOverview />
    </AppLayout>
  );
};

export default Index;
