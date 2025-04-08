
import React from 'react';
import { MenuIcon, Moon, Search, Shield, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b sticky top-0 z-30 bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
          <div className="hidden md:flex items-center gap-2">
            <Shield className="h-6 w-6 text-secure" />
            <span className="font-semibold text-lg">SecureCanvas</span>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 px-8">
          <div className="max-w-md w-full mx-auto relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search security documentation..."
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
