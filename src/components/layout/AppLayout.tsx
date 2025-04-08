
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full">
            <Navbar />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
