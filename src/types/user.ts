export type UserRole = 'admin' | 'recruiter';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
  profile?: UserProfile;
}

export interface RolePermissions {
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAllCandidates: boolean;
  canManageRecruiters: boolean;
  canAccessAnalytics: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canManageSettings: true,
    canViewAllCandidates: true,
    canManageRecruiters: true,
    canAccessAnalytics: true,
  },
  recruiter: {
    canManageUsers: false,
    canManageSettings: false,
    canViewAllCandidates: true,
    canManageRecruiters: false,
    canAccessAnalytics: false,
  },
}; 