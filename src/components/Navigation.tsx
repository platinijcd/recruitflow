
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Search, 
  UserCheck
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Tableau de bord'
    },
    {
      path: '/candidatures',
      icon: Users,
      label: 'Candidatures'
    },
    {
      path: '/postes',
      icon: FileText,
      label: 'Postes'
    },
    {
      path: '/entretiens',
      icon: Calendar,
      label: 'Entretiens'
    },
    {
      path: '/recruteurs',
      icon: UserCheck,
      label: 'Recruteurs'
    },
    {
      path: '/recherche',
      icon: Search,
      label: 'Recherche LinkedIn'
    }
  ];

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-recruit-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
