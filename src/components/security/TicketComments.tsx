import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useUsers } from '@/hooks/useUsers';
import { Send } from 'lucide-react';

type TicketCommentsProps = {
  ticketId: string;
};

type Comment = {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const TicketComments = ({ ticketId }: TicketCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { users } = useUsers();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('ticket_comments')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error',
          description: 'Could not load comments. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    // Subscribe to new comments
    const subscription = supabase
      .channel(`ticket-comments-${ticketId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ticket_comments',
        filter: `ticket_id=eq.${ticketId}`,
      }, (payload) => {
        setComments(prev => [...prev, payload.new as Comment]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [ticketId, toast]);

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? `${foundUser.first_name} ${foundUser.last_name}` : 'Unknown user';
  };

  const getUserInitials = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    if (!foundUser) return 'UN';
    return `${foundUser.first_name.charAt(0)}${foundUser.last_name.charAt(0)}`;
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;
    
    setSubmitting(true);
    
    try {
      // Add comment
      const { error: commentError } = await supabase
        .from('ticket_comments')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          content: newComment.trim(),
        });
      
      if (commentError) throw commentError;
      
      // Add ticket activity for the comment
      const { error: activityError } = await supabase
        .from('ticket_activities')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          activity_type: 'comment_added',
          details: { comment_preview: newComment.substring(0, 50) }
        });
      
      if (activityError) throw activityError;
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Could not add your comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitComment();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment on this ticket.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={`/api/avatar?userId=${comment.user_id}`} />
                <AvatarFallback>{getUserInitials(comment.user_id)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{getUserName(comment.user_id)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment... (Ctrl+Enter to submit)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="resize-none"
          disabled={!user || submitting}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || !user || submitting}
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Sending...' : 'Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketComments; 