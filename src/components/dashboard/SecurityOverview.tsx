
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SecurityStatistics from './SecurityStatistics';
import DocumentsList from './DocumentsList';
import { Button } from '@/components/ui/button';
import { FileText, Plus, ShieldAlert } from 'lucide-react';

const SecurityOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your organization's security posture
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Run Assessment
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <SecurityStatistics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentsList />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Report Vulnerability
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Update Compliance Status
                </Button>
              </div>
              
              <div className="mt-6 p-3 bg-muted rounded-md">
                <div className="font-medium mb-1">Need assistance?</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Use our AI assistant to help with security documentation, policy generation, and more.
                </p>
                <Button size="sm" className="w-full bg-secure hover:bg-secure-darker">
                  Open AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityOverview;
