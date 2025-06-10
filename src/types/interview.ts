import type { Database } from '@/integrations/supabase/types';

export type InterviewStatus = Database['public']['Enums']['interviews_status'];

export interface Interview {
  id: string;
  candidate_id: string;
  recruiter_id: string;
  post_id: string;
  scheduled_at: string;
  interview_status: InterviewStatus;
  location: string | null;
  feedback: string | null;
  created_at: string;
  // Join fields
  candidate_name?: string;
  recruiter_name?: string;
  post_title?: string;
}

export interface InterviewFilters {
  status?: InterviewStatus;
  startDate?: string;
  endDate?: string;
  recruiterId?: string;
  positionId?: string;
} 