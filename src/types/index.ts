
export interface Candidature {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  lien_linkedin?: string;
  poste_souhaite: string;
  statut: 'A évaluer' | 'Pertinent' | 'Rejeté' | 'Entretien programmé';
  date_reception: string;
  note?: number;
  commentaire_evaluateur?: string;
  date_entretien?: string;
  recruteur_assigne?: string;
  google_calendar_event_id?: string;
  cv_url?: string;
  competences?: string[];
  experience_annees?: number;
}

export interface Poste {
  id: string;
  titre: string;
  description: string;
  nombre_de_postes: number;
  date_limite: string;
  recruteurs_assignes: string[];
  date_creation: string;
  statut: 'Ouvert' | 'Fermé' | 'En pause';
  salaire_min?: number;
  salaire_max?: number;
  lieu?: string;
  type_contrat?: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
}

export interface Recruteur {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: 'Admin' | 'Recruteur' | 'Lecteur';
  avatar_url?: string;
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
  candidature_id: string;
  recruteur_id: string;
  date_entretien: string;
  duree_minutes: number;
  type: 'Téléphonique' | 'Visioconférence' | 'Présentiel';
  lien_meet?: string;
  notes?: string;
  statut: 'Programmé' | 'Terminé' | 'Annulé' | 'Reporter';
}
