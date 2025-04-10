
import React, { useState, useEffect } from 'react';
// Stub implementation for @supabase/auth-helpers-react
// This provides just enough implementation to satisfy TypeScript

import { supabase } from '@/lib/supabase';

export function useSupabaseClient() {
  return supabase;
}

export function useUser() {
  // This is a simplified version - in real implementation it would react to auth state
  const getUserFromSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
  };
  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getUserFromSession().then(setUser);
    
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  
  return user;
}

export function useSessionContext() {
  return {
    isLoading: false,
    session: null,
    error: null,
    supabaseClient: supabase
  };
}
