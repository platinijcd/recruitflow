
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Interview, InterviewFilters, InterviewStatus } from '@/types/interview';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type DbInterview = Database['public']['Tables']['interviews']['Row'] & {
  candidates: {
    id: string;
    name: string;
  };
  recruiters: {
    id: string;
    name: string;
  };
  posts: {
    id: string;
    title: string;
  };
};

export function useInterviews(filters: InterviewFilters = {}) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, [filters]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('interviews')
        .select(`
          *,
          candidates!interviews_candidate_id_fkey (id, name),
          recruiters!interviews_recruiter_id_fkey (id, name),
          posts!interviews_post_id_fkey (id, title)
        `);

      // Apply filters
      if (filters.status) {
        query = query.eq('interview_status', filters.status);
      }
      if (filters.startDate) {
        query = query.gte('scheduled_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('scheduled_at', filters.endDate);
      }
      if (filters.recruiterId) {
        query = query.eq('recruiter_id', filters.recruiterId);
      }
      if (filters.positionId) {
        query = query.eq('post_id', filters.positionId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const formattedInterviews: Interview[] = (data as unknown as DbInterview[]).map((interview) => ({
        ...interview,
        candidate_name: interview.candidates?.name || 'N/A',
        recruiter_name: interview.recruiters?.name || 'N/A',
        post_title: interview.posts?.title || 'N/A',
      }));

      setInterviews(formattedInterviews);
    } catch (err: any) {
      console.error('Error in fetchInterviews:', err);
      setError(err);
      // Only show toast error if it's a real error, not just empty data
      if (err.code !== 'PGRST116') {
        toast.error('Erreur lors du chargement des entretiens');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateInterviewStatus = async (interviewId: string, newStatus: InterviewStatus) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ interview_status: newStatus })
        .eq('id', interviewId);

      if (error) throw error;

      setInterviews(prevInterviews =>
        prevInterviews.map(interview =>
          interview.id === interviewId
            ? { ...interview, interview_status: newStatus }
            : interview
        )
      );

      toast.success('Statut mis à jour avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du statut');
      throw err;
    }
  };

  const deleteInterview = async (interviewId: string) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', interviewId);

      if (error) throw error;

      setInterviews(prevInterviews =>
        prevInterviews.filter(interview => interview.id !== interviewId)
      );

      toast.success('Entretien supprimé avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de la suppression de l\'entretien');
      throw err;
    }
  };

  const updateInterview = async (interviewId: string, updates: Partial<Pick<Interview, 'scheduled_at' | 'location' | 'interview_status' | 'feedback'>>) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', interviewId);

      if (error) throw error;

      setInterviews(prevInterviews =>
        prevInterviews.map(interview =>
          interview.id === interviewId
            ? { ...interview, ...updates }
            : interview
        )
      );

      toast.success('Entretien mis à jour avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour de l\'entretien');
      throw err;
    }
  };

  return {
    interviews,
    loading,
    error,
    updateInterviewStatus,
    deleteInterview,
    updateInterview,
    refetch: fetchInterviews,
  };
}
