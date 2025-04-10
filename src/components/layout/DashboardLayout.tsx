import React from 'react';
import AppLayout from './AppLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        {children}
      </div>
    </AppLayout>
  );
};

export default DashboardLayout; 