
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, LucideIcon } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  link: string;
  requiredRoles: UserRole[];
}

interface QuickAccessWidgetsProps {
  widgets: DashboardWidget[];
  role: UserRole | null;
}

const QuickAccessWidgets: React.FC<QuickAccessWidgetsProps> = ({ widgets, role }) => {
  // Filter widgets based on user role
  const filteredWidgets = widgets.filter(widget => {
    if (!role) return false;
    
    if (role === 'administrator') return true;
    
    return widget.requiredRoles.includes(role);
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>Shortcuts to important tools</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {filteredWidgets.slice(0, 6).map(widget => (
          <Button key={widget.id} variant="outline" className="justify-start h-auto py-3" asChild>
            <Link to={widget.link} className="flex items-center">
              <div className={`mr-3 p-2 rounded-md ${widget.color}`}>
                <widget.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">{widget.title}</div>
                <div className="text-xs text-muted-foreground">{widget.description}</div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-secure hover:bg-secure-darker" asChild>
          <Link to="/documents?new=true">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Document
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickAccessWidgets;
