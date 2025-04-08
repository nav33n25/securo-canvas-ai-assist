
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/services/documentService';
import AppLayout from '@/components/layout/AppLayout';
import DocumentsList from '@/components/dashboard/DocumentsList';
import SecurityOverview from '@/components/dashboard/SecurityOverview';
import SecurityStatistics from '@/components/dashboard/SecurityStatistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments
  });

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your security workspace. Manage your documents and monitor security metrics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SecurityStatistics className="md:col-span-2" />
          <SecurityOverview className="md:col-span-1" />
        </div>
        
        <Tabs defaultValue="documents" className="w-full">
          <TabsList>
            <TabsTrigger value="documents">Recent Documents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="tasks">Security Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <DocumentsList 
              documents={documents} 
              isLoading={isLoading} 
              limit={5} 
              showViewAll={true} 
            />
          </TabsContent>
          <TabsContent value="templates">
            <div className="bg-background rounded-md border shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Security Document Templates</h3>
              <p className="text-muted-foreground">
                Use pre-built templates to quickly create security documentation.
              </p>
              <div className="mt-4">
                <a href="/templates" className="text-secure hover:underline">
                  Browse all templates →
                </a>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tasks">
            <div className="bg-background rounded-md border shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Security Tasks</h3>
              <p className="text-muted-foreground">
                This feature will be available in the next phase of development.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
