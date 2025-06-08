import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Search, User, BarChart3 } from 'lucide-react';
const Navigation = () => {
  const location = useLocation();
  const navItems = [{
    path: '/',
    label: 'Dashboard',
    icon: BarChart3
  }, {
    path: '/candidatures',
    label: 'Candidatures',
    icon: Users
  }, {
    path: '/postes',
    label: 'Postes',
    icon: Briefcase
  }, {
    path: '/recherche',
    label: 'Recherche',
    icon: Search
  }, {
    path: '/recruteurs',
    label: 'Recruteurs',
    icon: User
  }];
  return <nav className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-recruit-blue mb-6">
      </h2>
        <div className="space-y-2">
          {navItems.map(item => {
          const Icon = item.icon;
          return <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-recruit-blue text-white' : 'text-gray-700 hover:bg-recruit-gray-light'}`}>
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>;
        })}
        </div>
      </div>
    </nav>;
};
export default Navigation;