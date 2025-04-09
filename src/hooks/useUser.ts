
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserState {
  user: User | null;
  workspace: {
    id: string;
    name: string;
  } | null;
  loading: boolean;
}

export const useUser = () => {
  const [state, setState] = useState<UserState>({
    user: null,
    workspace: null,
    loading: true
  });

  useEffect(() => {
    // Get the current user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Get workspace info if user exists
        let workspace = null;
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('team_id')
            .eq('id', user.id)
            .single();
          
          if (data?.team_id) {
            const { data: teamData } = await supabase
              .from('teams')
              .select('id, name')
              .eq('id', data.team_id)
              .single();
            
            if (teamData) {
              workspace = {
                id: teamData.id,
                name: teamData.name
              };
            }
          }
        }
        
        setState({
          user,
          workspace,
          loading: false
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user || null,
          loading: false
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
