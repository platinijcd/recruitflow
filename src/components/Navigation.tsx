import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Search, User, BarChart3, Calendar, MessageSquare, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const location = useLocation();
  const { userRole, profile } = useAuth();

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: BarChart3,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/candidatures',
      label: 'Candidatures',
      icon: Users,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/postes',
      label: 'Postes',
      icon: Briefcase,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/entretiens',
      label: 'Entretiens',
      icon: Calendar,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/recruteurs',
      label: 'Recruteurs',
      icon: User,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/recherche',
      label: 'Recherche',
      icon: Search,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/chat',
      label: 'Chat',
      icon: MessageSquare,
      roles: ['admin', 'recruiter']
    },
    {
      path: '/users',
      label: 'Gestion Utilisateurs',
      icon: Shield,
      roles: ['admin']
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      roles: ['admin']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole || 'recruiter')
  );

  return (
    <nav className="w-64 bg-white shadow-sm min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-recruit-blue mb-2">
            RecruitFlow
          </h2>
          {profile && (
            <div className="text-sm text-gray-600">
              <p>{profile.first_name} {profile.last_name}</p>
              <Badge variant={userRole === 'admin' ? 'destructive' : 'default'} className="mt-1">
                {userRole === 'admin' ? 'Administrateur' : 'Recruteur'}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-recruit-blue text-white' 
                    : 'text-gray-700 hover:bg-recruit-gray-light'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;