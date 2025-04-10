
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  avatar_url?: string;
  job_title?: string;
  role?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url, job_title, role')
          .order('first_name', { ascending: true });
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error : new Error('Failed to load users'));
        toast({
          title: 'Error',
          description: 'Failed to load user data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };
  
  const getUserFullName = (userId: string): string => {
    const user = getUserById(userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };
  
  const getUserInitials = (userId: string): string => {
    const user = getUserById(userId);
    if (!user) return 'UN';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  };
  
  return { 
    users, 
    loading, 
    error,
    getUserById,
    getUserFullName,
    getUserInitials
  };
}
