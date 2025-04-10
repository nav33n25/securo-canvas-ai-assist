import React, { useRef } from 'react';
import { Editor, EditorInstance } from "novel";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabase';
import { DocumentSensitivity } from '@/types/usoh';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface SecureNovelEditorProps {
  content?: string;
  setContent: (content: string | undefined) => void;
  title: string;
  sensitivity?: DocumentSensitivity;
  documentId?: string;
  complianceFrameworks?: string[];
  readOnly?: boolean;
}

// Helper functions
function getSensitivityClass(sensitivity: string) {
  switch(sensitivity) {
    case "public": return "bg-green-100 text-green-800";
    case "internal": return "bg-blue-100 text-blue-800";
    case "confidential": return "bg-yellow-100 text-yellow-800";
    case "restricted": return "bg-red-100 text-red-800";
    default: return "bg-gray-100";
  }
}

async function logEditActivity(documentId: string | undefined, userId: string | undefined) {
  if (documentId && userId) {
    try {
      await supabase.from("document_activities").insert({
        user_id: userId,
        document_id: documentId,
        action: "edit",
        details: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error("Failed to log edit activity:", error);
    }
  }
}

function sanitizeContent(content: string | undefined): any {
  if (!content) return undefined;
  
  try {
    // If it's already JSON, parse it
    if (content.startsWith('{') || content.startsWith('[')) {
      return JSON.parse(content);
    }
    
    // If it's HTML, convert to a basic doc structure
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: content
            }
          ]
        }
      ]
    };
  } catch (error) {
    console.error("Error sanitizing content:", error);
    return {
      type: "doc",
      content: []
    };
  }
}

export default function SecureNovelEditor({ 
  content, 
  setContent, 
  title,
  sensitivity = "internal",
  documentId,
  complianceFrameworks = [],
  readOnly = false
}: SecureNovelEditorProps) {
  const { user, hasPermission } = useAuth();
  const editorRef = useRef<EditorInstance>(null);
  
  // Check if user has permission to edit based on sensitivity
  const canEdit = !readOnly && user && hasPermission([`edit_${sensitivity}_documents`]);

  // Initial content handling
  const sanitizedContent = sanitizeContent(content);

  // Handle secure image upload to Supabase
  const handleSecureImageUpload = async (file: File) => {
    try {
      // Validate file size and type
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large (max 5MB)");
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error("Only image files are allowed");
      }

      // Create a secure filename
      const timestamp = Date.now();
      const userId = user?.id;
      const fileExt = file.name.split('.').pop();
      const secureFilename = `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("secure-documents")
        .upload(secureFilename, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("secure-documents")
        .getPublicUrl(secureFilename);

      // Log the upload activity
      await supabase.from("document_activities").insert({
        user_id: userId,
        action: "upload_image",
        resource_id: secureFilename,
        details: { contentType: file.type, size: file.size }
      });

      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Could not upload image"
      });
      return null;
    }
  };

  return (
    <div className="secure-editor-container">
      <div className="flex justify-between items-center mb-2">
        <h2 className="pt-4 pb-3">{title}</h2>
        <div className="flex gap-2 items-center">
          <span className={`px-2 py-1 rounded text-xs ${getSensitivityClass(sensitivity)}`}>
            {sensitivity.toUpperCase()}
          </span>
          {complianceFrameworks.map(framework => (
            <Badge key={framework} variant="outline" className="text-xs">
              {framework}
            </Badge>
          ))}
        </div>
      </div>
      
      {canEdit ? (
        <Editor
          ref={editorRef}
          defaultValue={sanitizedContent}
          onDebouncedUpdate={(editor) => {
            // Log edit activity for audit trail
            logEditActivity(documentId, user?.id);
            setContent(editor?.getHTML());
          }}
          disableLocalStorage={true} // Security best practice
          className="rounded-md border shadow-none"
          uploadImage={handleSecureImageUpload}
          completionApi="/api/secure-generate"
          debounceDuration={750}
        />
      ) : (
        <div className="border rounded-md p-4 bg-gray-50">
          <div dangerouslySetInnerHTML={{ __html: content || "" }} />
          {readOnly && (
            <p className="text-sm text-gray-500 mt-4">This document is in read-only mode.</p>
          )}
          {!hasPermission([`edit_${sensitivity}_documents`]) && (
            <p className="text-sm text-red-500 mt-4">You don't have permission to edit this document.</p>
          )}
        </div>
      )}
    </div>
  );
} 