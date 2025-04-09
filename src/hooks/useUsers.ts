import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, role, avatar_url')
          .order('first_name', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch users'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Subscribe to changes in the users table
    const usersSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        (payload) => {
          // Handle different change types
          if (payload.eventType === 'INSERT') {
            setUsers(prev => [...prev, payload.new as User]);
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => 
              prev.map(user => user.id === payload.new.id ? { ...user, ...payload.new } : user)
            );
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(user => user.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      usersSubscription.unsubscribe();
    };
  }, []);

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const getUserName = (id: string): string => {
    const user = getUserById(id);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const getUserInitials = (id: string): string => {
    const user = getUserById(id);
    if (!user) return 'UN';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  return { 
    users, 
    loading, 
    error, 
    getUserById,
    getUserName,
    getUserInitials
  };
} 