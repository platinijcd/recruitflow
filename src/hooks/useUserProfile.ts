import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { UserProfile, UserRole } from '@/types/user';

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
    },
  });

  const updateRole = useMutation({
    mutationFn: async (role: UserRole) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    updateRole: updateRole.mutate,
    isUpdating: updateProfile.isPending,
    isUpdatingRole: updateRole.isPending,
  };
};

export const useAllUserProfiles = () => {
  const { profile: currentUserProfile } = useUserProfile();

  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allUserProfiles'],
    queryFn: async (): Promise<UserProfile[]> => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: currentUserProfile?.role === 'admin',
  });

  return {
    profiles,
    isLoading,
    error,
    canAccess: currentUserProfile?.role === 'admin',
  };
}; 