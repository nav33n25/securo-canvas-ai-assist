import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import CommandPalette from '@/components/ui/command-palette';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check for Command/Control + K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setCommandPaletteOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
            <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
            <main className={`flex-1 overflow-auto p-2 ${isMobile ? 'pb-16' : 'p-4 md:p-6'}`}>
              {children}
            </main>
          </div>
          <CommandPalette 
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
          />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
