
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { UserProfile, UserRole, SubscriptionTier, SubscriptionPlan, tierToPlanMap } from '@/types/auth-types';
import { LegacyUserRole, legacyToNewRoleMap } from '@/types/common';

interface UseProfileManagerProps {
  user: User | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
  setSubscriptionTier: React.Dispatch<React.SetStateAction<SubscriptionTier | null>>;
  setSubscriptionPlan: React.Dispatch<React.SetStateAction<SubscriptionPlan | null>>;
  setTeam: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useProfileManager({
  user,
  setProfile,
  setRole,
  setSubscriptionTier,
  setSubscriptionPlan,
  setTeam,
  setLoading
}: UseProfileManagerProps) {

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Profile Error",
          description: "Failed to load your profile information. Please refresh and try again.",
        });
        setLoading(false);
        return;
      }
      
      // Fetch team membership if applicable
      if (profileData && profileData.team_id) {
        try {
          // Only attempt to fetch team if there's a team_id
          const { data: teamData } = await supabase
            .rpc('get_team_name', { team_id: profileData.team_id });
            
          if (teamData) {
            setTeam(teamData);
          } else {
            setTeam(null);
          }
        } catch (teamError) {
          console.error('Error fetching team:', teamError);
          setTeam(null);
        }
      }
      
      try {
        // Add email from the user object if available
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          const profileWithEmail = {
            ...(profileData as UserProfile),
            email: data.user.email
          };
          setProfile(profileWithEmail);
          
          // Handle role and subscription tier
          handleUserRoleAndPlan(profileWithEmail, userId);
        } else {
          setProfile(profileData as UserProfile);
          
          // Handle role and subscription tier
          handleUserRoleAndPlan(profileData, userId);
        }
      } catch (userError) {
        console.error('Error getting user email:', userError);
        setProfile(profileData as UserProfile);
        
        // Handle role and subscription tier even without email
        handleUserRoleAndPlan(profileData, userId);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Profile Error",
        description: "Unexpected error while loading profile data.",
      });
      setLoading(false);
    }
  };
  
  // Helper to handle user role and subscription tier/plan
  const handleUserRoleAndPlan = async (profileData: any, userId: string) => {
    // Process role - handle legacy roles as well
    if (profileData.role) {
      if (Object.keys(legacyToNewRoleMap).includes(profileData.role as string)) {
        // Convert legacy role to new role
        const newRole = legacyToNewRoleMap[profileData.role as LegacyUserRole];
        setRole(newRole);
        
        // Update profile with new role format
        try {
          await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);
        } catch (e) {
          console.error('Error updating role:', e);
        }
      } else {
        // Set directly if already using new role format
        setRole(profileData.role as UserRole);
      }
    } else {
      // Default to individual_basic if no role is set
      setRole('individual_basic');
      
      // Update the profile with the default role
      try {
        await supabase
          .from('profiles')
          .update({ role: 'individual_basic' })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default role:', e);
      }
    }
    
    // Process subscription plan (older field)
    if (profileData.subscription_plan) {
      setSubscriptionPlan(profileData.subscription_plan as SubscriptionPlan);
    } else {
      // Default to free if no subscription plan is set
      setSubscriptionPlan('free');
      
      // Update the profile with the default subscription plan
      try {
        await supabase
          .from('profiles')
          .update({ subscription_plan: 'free' })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default subscription plan:', e);
      }
    }
    
    // Process subscription tier (newer field)
    if (profileData.subscription_tier) {
      setSubscriptionTier(profileData.subscription_tier as SubscriptionTier);
      // Also update the plan for backward compatibility
      setSubscriptionPlan(tierToPlanMap[profileData.subscription_tier as SubscriptionTier]);
    } else if (profileData.subscription_plan) {
      // If we have a plan but no tier, set a default tier based on the plan
      let tier: SubscriptionTier = 'individual';
      switch (profileData.subscription_plan) {
        case 'pro':
          tier = 'professional';
          break;
        case 'team':
          tier = 'smb';
          break;
        case 'enterprise':
          tier = 'enterprise';
          break;
      }
      setSubscriptionTier(tier);
      
      // Update the profile with the default subscription tier
      try {
        await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default subscription tier:', e);
      }
    } else {
      // No plan or tier, set defaults
      setSubscriptionTier('individual');
      setSubscriptionPlan('free');
      
      try {
        await supabase
          .from('profiles')
          .update({ 
            subscription_tier: 'individual',
            subscription_plan: 'free'
          })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default subscription:', e);
      }
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare update data, removing any undefined fields
      const updateData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      // Add updated timestamp
      updateData.updated_at = new Date().toISOString();
      
      // Update the profile
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
  
        if (error) {
          toast({
            variant: "destructive",
            title: "Profile update failed",
            description: error.message,
          });
          return;
        }
      } catch (e) {
        console.error('Error updating profile:', e);
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: "Failed to update profile",
        });
        return;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      // Update role if it's being changed
      if (data.role) {
        // Convert legacy role if needed
        let processedRole = data.role;
        if (Object.keys(legacyToNewRoleMap).includes(data.role as string)) {
          processedRole = legacyToNewRoleMap[data.role as LegacyUserRole];
        }
        setRole(processedRole as UserRole);
      }
      
      // Update subscription plan if it's being changed
      if (data.subscription_plan) {
        setSubscriptionPlan(data.subscription_plan);
      }
      
      // Update subscription tier if it's being changed
      if (data.subscription_tier) {
        setSubscriptionTier(data.subscription_tier);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    updateProfile
  };
}
