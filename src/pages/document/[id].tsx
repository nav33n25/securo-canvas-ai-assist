
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DocumentEditor from '@/components/editor/DocumentEditor';

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout>
      <DocumentEditor />
    </AppLayout>
  );
};

export default DocumentPage;
