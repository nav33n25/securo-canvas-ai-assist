
import { rolePermissions } from '@/types/common';
import { UserRole } from '@/types/auth-types';

export function useUserPermissions(role: UserRole | null) {
  // Function to check if user has specific permissions based on role
  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!role) return false;
    
    // Get the permissions for the user's role
    const userPermissions = rolePermissions[role] || [];
    
    // Check if the user has all required permissions
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  };

  return { hasPermission };
}
