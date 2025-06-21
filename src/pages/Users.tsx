import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import UserManagement from '@/components/UserManagement';
import type { UserRole } from '@/types/user';

const Users = () => {
  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <div className="p-6">
        <UserManagement />
      </div>
    </RoleProtectedRoute>
  );
};

export default Users; 