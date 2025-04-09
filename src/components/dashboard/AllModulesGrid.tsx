
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { DashboardWidget } from './QuickAccessWidgets';

interface AllModulesGridProps {
  widgets: DashboardWidget[];
  role: UserRole | null;
}

const AllModulesGrid: React.FC<AllModulesGridProps> = ({ widgets, role }) => {
  // Filter widgets based on user role
  const filteredWidgets = widgets.filter(widget => {
    if (!role) return false;
    
    if (role === 'administrator') return true;
    
    return widget.requiredRoles.includes(role);
  });
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWidgets.map(widget => (
          <Card key={widget.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-md ${widget.color}`}>
                  <widget.icon className="h-5 w-5" />
                </div>
              </div>
              <CardTitle className="text-lg mt-2">{widget.title}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link to={widget.link}>
                  <span>Open</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-md bg-secure/10 text-secure">
                <PlusCircle className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-lg mt-2">Create New Document</CardTitle>
            <CardDescription>Start a new security document from scratch</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full justify-between bg-secure hover:bg-secure-darker" asChild>
              <Link to="/documents?new=true">
                <span>Create</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AllModulesGrid;
