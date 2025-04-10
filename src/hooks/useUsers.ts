
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/common';

type UseUsersResult = {
  users: User[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, avatar_url, role, team_id');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
      
      // Provide fallback data for demo/development
      setUsers([
        {
          id: 'user-001',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          avatar_url: 'https://ui-avatars.com/api/?name=Admin+User',
          role: 'administrator'
        },
        {
          id: 'user-002',
          email: 'manager@example.com',
          first_name: 'Team',
          last_name: 'Manager',
          avatar_url: 'https://ui-avatars.com/api/?name=Team+Manager',
          role: 'team_manager',
          team_id: 'team-001'
        },
        {
          id: 'user-003',
          email: 'member@example.com',
          first_name: 'Team',
          last_name: 'Member',
          avatar_url: 'https://ui-avatars.com/api/?name=Team+Member',
          role: 'team_member',
          team_id: 'team-001'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
};
