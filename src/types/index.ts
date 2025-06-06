
export interface Candidature {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  linkedin_url?: string;
  desired_position?: string;
  application_status: 'To Be Reviewed' | 'Relevant' | 'Rejectable';
  application_date?: string;
  relevance_score?: number;
  score_justification?: string;
  interview_date?: string;
  recruiter_assigned?: string;
  interviewer_id?: string;
  evaluation_status: 'Not Started' | 'Scheduled' | 'Hired' | 'Rejected';
  cv_link?: string;
  post_id?: string;
  experiences?: Array<{
    position: string;
    company: string;
    duration: string;
    missions: string;
  }>;
  degrees?: Array<{
    title: string;
    institution: string;
    specialization: string;
  }>;
  skills?: string[];
  certifications?: string[];
  profile_summary?: string;
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

export interface Entretien {
  id: string;
  candidate_id?: string;
  recruiter_id?: string;
  post_id?: string;
  scheduled_at: string;
  location?: string;
  interviews_status: 'Scheduled' | 'Done';
  feedback?: string;
  created_at?: string;
  candidates?: { name: string; email: string };
  posts?: { title: string };
  recruiters?: { name: string };
}
