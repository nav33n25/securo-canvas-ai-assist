
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface TicketCommentsProps {
  ticketId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  parent_comment_id?: string;
}

const TicketComments: React.FC<TicketCommentsProps> = ({ ticketId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase.rpc('get_ticket_comments', {
          p_ticket_id: ticketId
        });
        
        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load comments",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [ticketId, toast]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.rpc('add_ticket_comment', {
        p_ticket_id: ticketId,
        p_content: newComment,
        p_user_id: user.id
      });
      
      if (error) throw error;
      
      setNewComment('');
      
      // Refresh comments
      const { data: updatedComments } = await supabase.rpc('get_ticket_comments', {
        p_ticket_id: ticketId
      });
      setComments(updatedComments || []);
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user_avatar || ''} />
                <AvatarFallback>
                  {comment.user_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{comment.user_name || 'Unknown User'}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment} 
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketComments;
