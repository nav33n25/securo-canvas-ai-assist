
import { useContext } from 'react';
import { AuthContext, ProfileUpdateParams, RegisterParams } from '@/contexts/AuthContext';
import { SubscriptionTier, CombinedUserRole, SubscriptionPlan } from '@/types/auth-types';

export type { ProfileUpdateParams, RegisterParams };

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    ...context,
    login: (email: string, password: string) => {
      console.log('Login called with:', email);
      // Simulate successful login
      if (context.user) return Promise.resolve();
      
      return context.login(email, password);
    },
    register: (params: RegisterParams) => {
      console.log('Register called with:', params);
      // Simulate successful registration
      return context.register({
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        subscriptionTier: (params.subscriptionTier || 'free') as SubscriptionTier,
        role: params.role as CombinedUserRole
      });
    },
    resetPassword: (email: string) => {
      console.log('Reset password called for:', email);
      // Simulate password reset
      return Promise.resolve();
    },
    confirmPasswordReset: (token: string, newPassword: string) => {
      console.log('Confirm password reset called with token:', token);
      // Simulate password reset confirmation
      return Promise.resolve();
    },
    updateProfile: (params: ProfileUpdateParams) => {
      console.log('Update profile called with:', params);
      // Pass the update to the context's updateProfile
      return context.updateProfile(params);
    }
  };
}
