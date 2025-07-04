import type { Database } from '@/integrations/supabase/types';

export type ApplicationStatus = Database['public']['Enums']['application_status'];

export interface Candidature {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  lien_linkedin?: string;
  poste_souhaite?: string;
  titre_poste?: string;
  statut: ApplicationStatus;
  date_reception?: string;
  note?: number;
  commentaire_evaluateur?: string;
  competences?: string[];
  experience_annees?: number;
}

export interface Poste {
  id: string;
  title: string;
  description?: string;
  post_status: 'Open' | 'Close';
  created_at?: string;
  location?: string;
  enterprise?: string;
  department?: string;
}

export interface Recruteur {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  created_at?: string;
}

export interface LinkedInProfile {
  nom: string;
  titre_poste: string;
  entreprise: string;
  lieu: string;
  lien_linkedin: string;
  photo_url?: string;
  experience_annees?: number;
  competences?: string[];
}

// Types pour correspondre à la base de données Supabase
export interface CandidateDB {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  desired_position?: string;
  application_status: ApplicationStatus;
  application_date?: string;
  relevance_score?: number;
  score_justification?: string;
  recruiter_assigned?: string;
  interviewer_id?: string;
  evaluation_status: 'Not Started' | 'Scheduled' | 'Hired' | 'Rejected';
  cv_link?: string;
  post_id?: string;
  experiences?: any[];
  degrees?: any[];
  skills?: any[];
  certifications?: any[];
  profile_summary?: string;
}
