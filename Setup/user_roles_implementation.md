# User Roles Implementation Guide

## Overview
This guide explains how to implement user roles (admin, recruiter) in your RecruitFlow application.

## Current Authentication System
Your application currently uses:
- **Supabase Authentication** for user management
- **React Context** for global auth state
- **Protected Routes** for basic authentication
- **Recruiters table** with a basic `role` field

## New Role-Based System

### 1. Database Schema Changes

Run the SQL commands in `Setup/user_roles_schema.sql` in your Supabase SQL editor:

```sql
-- This creates the new user_profiles table and related structures
-- Run this in your Supabase SQL editor
```

### 2. Key Components Added

#### TypeScript Types (`src/types/user.ts`)
- `UserRole` enum: 'admin' | 'recruiter'
- `UserProfile` interface for user profile data
- `RolePermissions` interface for role-based permissions
- `ROLE_PERMISSIONS` constant defining what each role can do

#### Authentication Context (`src/contexts/AuthContext.tsx`)
- Enhanced to include user profile and role information
- Automatically fetches user profile on authentication
- Provides role and permission data to components

#### Custom Hooks (`src/hooks/useUserProfile.ts`)
- `useUserProfile()`: Manage current user's profile
- `useAllUserProfiles()`: Admin-only hook for managing all users

#### Route Protection (`src/components/RoleProtectedRoute.tsx`)
- Role-based route protection
- Redirects unauthorized users to fallback path

#### User Management (`src/components/UserManagement.tsx`)
- Admin interface for managing user roles
- Real-time role updates with Supabase

### 3. Role Permissions

#### Admin Permissions
- ✅ Manage all users and their roles
- ✅ Access all application settings
- ✅ View all candidates and data
- ✅ Manage recruiters
- ✅ Access analytics and reports

#### Recruiter Permissions
- ❌ Cannot manage users
- ❌ Cannot access settings
- ✅ Can view and manage candidates
- ❌ Cannot manage other recruiters
- ❌ Cannot access analytics

### 4. Implementation Steps

#### Step 1: Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL commands from `Setup/user_roles_schema.sql`
4. Verify the `user_profiles` table is created

#### Step 2: Update Existing Users
For existing users, you'll need to create profiles manually:

```sql
-- Create profiles for existing users (run this after schema setup)
INSERT INTO public.user_profiles (user_id, email, first_name, last_name, role)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'first_name',
  au.raw_user_meta_data->>'last_name',
  'admin'::user_role  -- Set first user as admin
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.user_id = au.id
);
```

#### Step 3: Test the Implementation
1. Sign up a new user (should automatically get 'recruiter' role)
2. Manually promote a user to admin in the database
3. Test role-based navigation and access

### 5. Usage Examples

#### Protecting Routes
```tsx
import RoleProtectedRoute from '@/components/RoleProtectedRoute';

const AdminOnlyPage = () => (
  <RoleProtectedRoute allowedRoles={['admin']}>
    <div>Admin only content</div>
  </RoleProtectedRoute>
);
```

#### Checking Permissions in Components
```tsx
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { permissions, userRole } = useAuth();
  
  if (permissions?.canManageUsers) {
    return <UserManagementInterface />;
  }
  
  return <div>Access denied</div>;
};
```

#### Managing User Profiles
```tsx
import { useUserProfile } from '@/hooks/useUserProfile';

const ProfileComponent = () => {
  const { profile, updateProfile, updateRole } = useUserProfile();
  
  const handleRoleChange = (newRole) => {
    updateRole(newRole);
  };
};
```

### 6. Security Considerations

#### Row Level Security (RLS)
- All tables have RLS policies enabled
- Users can only access data they're authorized to see
- Admins have broader access through specific policies

#### Role Validation
- Server-side role validation in database functions
- Client-side role checks for UI purposes
- Always validate permissions on the server side

### 7. Migration from Current System

#### Current vs New System
- **Current**: Basic `role` field in `recruiters` table
- **New**: Dedicated `user_profiles` table with proper relationships

#### Migration Strategy
1. Keep existing `recruiters` table for backward compatibility
2. Gradually migrate to using `user_profiles` for authentication
3. Update components to use new role system
4. Eventually deprecate old `recruiters` table

### 8. Testing Checklist

- [ ] New users get 'recruiter' role by default
- [ ] Admin can change user roles
- [ ] Role-based navigation works correctly
- [ ] Protected routes redirect unauthorized users
- [ ] RLS policies work correctly
- [ ] User profile data is properly synced

### 9. Troubleshooting

#### Common Issues
1. **User profile not created**: Check the trigger function
2. **RLS blocking access**: Verify policies are correct
3. **Role not updating**: Check mutation permissions
4. **Navigation not filtering**: Verify role data is loaded

#### Debug Commands
```sql
-- Check user profiles
SELECT * FROM public.user_profiles;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Test role function
SELECT public.get_user_role();
```

## Benefits of This Implementation

1. **Scalable**: Easy to add new roles and permissions
2. **Secure**: Row-level security and proper validation
3. **Maintainable**: Clear separation of concerns
4. **Flexible**: Role-based permissions can be easily modified
5. **User-friendly**: Intuitive admin interface for role management 