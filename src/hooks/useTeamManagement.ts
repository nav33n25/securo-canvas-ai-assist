
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types/auth-types';

interface UseTeamManagementProps {
  user: User | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setTeam: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useTeamManagement({
  user,
  setProfile,
  setTeam
}: UseTeamManagementProps) {

  // Join a team
  const joinTeam = async (teamId: string, role = 'member') => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to join a team.",
      });
      return;
    }

    try {
      // Check if already a member using RPC instead of direct table access
      try {
        const { data: isMember } = await supabase
          .rpc('check_team_membership', { 
            p_user_id: user.id, 
            p_team_id: teamId 
          });
          
        if (isMember) {
          toast({
            title: "Already a member",
            description: "You are already a member of this team.",
          });
          return;
        }
      } catch (e) {
        console.error('Error checking team membership:', e);
      }

      // Join the team using RPC
      try {
        await supabase.rpc('join_team', { 
          p_user_id: user.id, 
          p_team_id: teamId,
          p_role: role
        });
      } catch (e) {
        console.error('Error joining team:', e);
        toast({
          variant: "destructive",
          title: "Join failed",
          description: "Failed to join team",
        });
        return;
      }

      // Update profile with team ID
      try {
        await supabase
          .rpc('update_user_team', { 
            p_user_id: user.id, 
            p_team_id: teamId 
          });
      } catch (e) {
        console.error('Error updating user team:', e);
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, team_id: teamId } : null);
      
      // Get team name
      try {
        const { data: teamName } = await supabase
          .rpc('get_team_name', { team_id: teamId });
          
        if (teamName) {
          setTeam(teamName);
        }
      } catch (e) {
        console.error('Error getting team name:', e);
      }

      toast({
        title: "Team joined",
        description: "You have successfully joined the team.",
      });
    } catch (error: any) {
      console.error('Error joining team:', error);
      toast({
        variant: "destructive",
        title: "Join failed",
        description: error.message || "Failed to join team.",
      });
    }
  };

  // Leave a team
  const leaveTeam = async (teamId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to leave a team.",
      });
      return;
    }

    try {
      // Leave team using RPC
      try {
        await supabase.rpc('leave_team', { 
          p_user_id: user.id, 
          p_team_id: teamId 
        });
      } catch (e) {
        console.error('Error leaving team:', e);
        toast({
          variant: "destructive",
          title: "Leave failed",
          description: "Failed to leave team",
        });
        return;
      }

      // Update profile to remove team ID if it matches
      try {
        await supabase.rpc('remove_user_team', { 
          p_user_id: user.id, 
          p_team_id: teamId 
        });
      } catch (e) {
        console.error('Error removing team from user:', e);
      }

      // Update local state
      setTeam(null);
      setProfile(prev => prev && prev.team_id === teamId ? 
        { ...prev, team_id: undefined } : 
        prev
      );

      toast({
        title: "Team left",
        description: "You have successfully left the team.",
      });
    } catch (error: any) {
      console.error('Error leaving team:', error);
      toast({
        variant: "destructive",
        title: "Leave failed",
        description: error.message || "Failed to leave team.",
      });
    }
  };

  return {
    joinTeam,
    leaveTeam
  };
}
