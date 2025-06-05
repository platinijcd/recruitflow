
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Recruiter = Tables<'recruiters'>;

export const useRecruiters = () => {
  return useQuery({
    queryKey: ['recruiters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recruiters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreateRecruiter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recruiter: Omit<Recruiter, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('recruiters')
        .insert(recruiter)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters'] });
    }
  });
};
