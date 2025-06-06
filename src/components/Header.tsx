
import { Card } from '@/components/ui/card';

const Header = () => {
  return (
    <Card className="rounded-none border-b border-gray-200 shadow-sm bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-recruit-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">RecruitFlow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Bonjour, Utilisateur
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Header;
