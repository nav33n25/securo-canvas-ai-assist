
// Simple compatibility layer for components expecting useUser
import { useAuth } from './useAuth';

export function useUser() {
  const { user, profile } = useAuth();
  
  return { 
    user,
    profile,
    isLoading: false,
    error: null
  };
}

export default useUser;
