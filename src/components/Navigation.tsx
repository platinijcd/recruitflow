import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Briefcase, Search, User, BarChart3, Calendar, MessageSquare, Settings, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    // Listen for new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setHasNew(true);
        }
      )
      .subscribe();

    // Clear badge when visiting notifications page
    if (location.pathname === '/notifications') setHasNew(false);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [location.pathname]);

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
    path: '/entretiens',
    label: 'Entretiens',
    icon: Calendar
  }, 
  {
    path: '/recruteurs',
    label: 'Recruteurs',
    icon: User
  },
  {
    path: '/recherche',
    label: 'Recherche',
    icon: Search
  },
  {
    path: '/chat',
    label: 'Chat',
    icon: MessageSquare
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings
  }];
  return (
    <nav className="w-64 bg-white shadow-sm flex-shrink-0 overflow-y-auto flex flex-col h-full">
      <div className="p-6 flex-1">
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
      <div className="mb-4 flex justify-center">
        <button
          className="relative"
          onClick={() => {
            setHasNew(false);
            navigate('/notifications');
          }}
          aria-label="Notifications log"
        >
          <Info size={20} />
          {hasNew && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      </div>
    </nav>
  );
};
export default Navigation;