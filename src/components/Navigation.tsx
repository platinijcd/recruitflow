
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Search, 
  FileText,
  UserPlus,
  BarChart3
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      label: 'Tableau de bord', 
      path: '/', 
      icon: LayoutDashboard 
    },
    { 
      label: 'Candidatures', 
      path: '/candidatures', 
      icon: Users 
    },
    { 
      label: 'Postes', 
      path: '/postes', 
      icon: FileText 
    },
    { 
      label: 'Entretiens', 
      path: '/entretiens', 
      icon: Calendar 
    },
    { 
      label: 'Recherche LinkedIn', 
      path: '/recherche', 
      icon: Search 
    },
    { 
      label: 'Recruteurs', 
      path: '/recruteurs', 
      icon: UserPlus 
    },
    { 
      label: 'Statistiques', 
      path: '/statistiques', 
      icon: BarChart3 
    }
  ];

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  className={`w-full justify-start space-x-2 ${
                    isActive 
                      ? 'bg-recruit-blue text-white' 
                      : 'text-gray-700 hover:bg-recruit-blue-light hover:text-recruit-blue'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
