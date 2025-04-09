
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { SubscriptionTier } from '@/types/auth-types';

interface UseFeatureAccessProps {
  user: User | null;
  subscriptionTier: SubscriptionTier | null;
}

interface UseFeatureAccessReturn {
  hasFeatureAccess: (featureKey: string) => Promise<boolean>;
}

export function useFeatureAccess({ 
  user, 
  subscriptionTier 
}: UseFeatureAccessProps): UseFeatureAccessReturn {
  
  const hasFeatureAccess = async (featureKey: string): Promise<boolean> => {
    if (!user || !subscriptionTier) {
      return false;
    }

    try {
      // Simple implementation - check based on subscription tier
      if (subscriptionTier === 'individual' && featureKey.startsWith('premium_')) {
        return false;
      }
      
      if (subscriptionTier === 'professional' && featureKey.startsWith('enterprise_')) {
        return false;
      }
      
      if (subscriptionTier === 'smb' && 
        (featureKey.startsWith('enterprise_advanced_') || 
          featureKey === 'enterprise_unlimited_users')) {
        return false;
      }
      
      // For enterprise, all features are available
      if (subscriptionTier === 'enterprise') {
        return true;
      }

      // For other cases, try to query the feature table if it exists
      try {
        const { data, error } = await supabase
          .rpc('check_feature_access', {
            p_subscription_tier: subscriptionTier,
            p_feature_key: featureKey
          });
          
        if (error || data === null) {
          console.error('Error checking feature access:', error);
          return subscriptionTier !== 'individual'; // Default: free tier has limited access
        }
        
        return data;
      } catch (error) {
        console.error('Error in hasFeatureAccess RPC:', error);
        // Fallback behavior if RPC fails
        return subscriptionTier !== 'individual';
      }
    } catch (error) {
      console.error('Error in hasFeatureAccess:', error);
      return false;
    }
  };

  return { hasFeatureAccess };
}
